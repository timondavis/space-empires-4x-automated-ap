import { ApDecisionService } from './ApDecisionService';
import {AP} from "../../Model/AP";
import {DieHelper} from "../../Helper/DieHelper/DieHelper";
import {EconRollTable} from "../../Model/EconRollTable";
import {EconRollTableRow} from "../../Model/EconRollTableRow";
import {DieRange} from "../../Model/DieRange";
import {HumanState} from "../../Model/HumanState";
import {ApFleetHelper} from "../../Helper/ApFleetHelper/ApFleetHelper";
import {ApAndHumanComparisonHelper} from "../../Helper/ApAndHumanComparisonHelper/ApAndHumanComparisonHelper";
import {ApFleet} from "../../Model/ApFleet";
import {ApQuery} from "../ApQuery/ApQuery";
import {AppliedTech} from "../../Model/AppliedTech";
import {ApTechHelper} from "../../Helper/ApTechHelper/ApTechHelper";
import {ShipTemplate} from "../../Model/ShipTemplate";
import {ApDefenseFleetHelper} from "../../Helper/ApDefenseFleetHelper/ApDefenseFleetHelper";
import {FleetLaunchTable} from "../../Model/FleetLaunchTable";

describe('ApDecisionService', () => {
    /**
     * @type ApDecisionService
     */
    let service;

    beforeEach(() => {
        service = ApDecisionService.getInstance();
    });

    const rand = (max, min = 0) => {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    describe('adjustedRowIndex', () => {
        it ('will return the current round number, up until the 20th round (round 19)', () => {
            for (let i = 0 ; i < 20 ; i++ ) {
                expect( service.adjustedRowIndex(i) ).toBe( i );
            }
        })

        it ( 'will return either the 19th or 20th round ID (18 or 19) in modulation after the 20th round', () => {
            let number;
            for ( let i = 0 ; i < 20 ; i++ ) {
                number = Math.floor( Math.random() * 100 ) + 1
                number += 20;

                if ( number % 2 === 0 ) {
                    expect( service.adjustedRowIndex(number) ).toBe(18);
                } else {
                    expect( service.adjustedRowIndex(number) ).toBe(19);
                }
            }
        });
    });

    describe('rollEcon', () => {
        let ap;
        let econRollTable;
        let dieHelper;

        beforeEach( () => {
            ap = new AP(0, 5, 'blue');
            econRollTable = new EconRollTable();
            dieHelper = new DieHelper();
        });

        it ('rolls the number of dice instructed on the indicated row of the provided econ table', () => {

            const spy =
                jest.spyOn(dieHelper, 'd10' ).mockImplementation(() => 5);

            ap.difficultyIncrement = 1;

            for ( let i = 0 ; i < 20 ; i++ ) {

                let numDieRolls = rand(20, 1);
                let rowId = rand(19, 1);

                econRollTable.rows[rowId] = new EconRollTableRow(numDieRolls, new DieRange(5,5), new DieRange(0,0));
                ap.econTurn = rowId;

                ap = service.rollEcon(ap, econRollTable, dieHelper);

                expect(ap.fleet).toBe(numDieRolls);

                econRollTable = new EconRollTable();
                ap.fleet = 0;
            }

            spy.mockRestore();
        });

        it ( 'correctly assigns points to fleet CP', () => {

            const spy =
                jest.spyOn(dieHelper, 'd10' ).mockImplementation(() => 1);

            const rowId = rand(10);
            const rolls = rand(10, 1);
            const difficulty = rand(15, 1);
            econRollTable.rows[rowId] = new EconRollTableRow(rolls, new DieRange(1,1), new DieRange(0,0));
            ap.econTurn = rowId;
            ap.difficultyIncrement = difficulty;

            ap = service.rollEcon(ap, econRollTable, dieHelper);

            expect(ap.fleet).toBe(rolls * difficulty);

            spy.mockRestore();
        });

        it ( 'correctly assigns points to tech CP', () => {

            const spy =
                jest.spyOn(dieHelper, 'd10' ).mockImplementation(() => 1);

            const rowId = rand(10);
            const rolls = rand(10, 1);
            const difficulty = rand(15, 1);
            econRollTable.rows[rowId] = new EconRollTableRow(rolls, new DieRange(0,0), new DieRange(1,1));
            ap.econTurn = rowId;
            ap.difficultyIncrement = difficulty;

            ap = service.rollEcon(ap, econRollTable, dieHelper);

            expect(ap.tech).toBe(rolls * difficulty);

            spy.mockRestore();
        });

        it ( 'correctly assigns points to defense CP', () => {
            const spy =
                jest.spyOn(dieHelper, 'd10' ).mockImplementation(() => 1);

            const rowId = rand(10);
            const rolls = rand(10, 1);
            const difficulty = rand(15, 1);
            econRollTable.rows[rowId] = new EconRollTableRow(rolls, new DieRange(0,0), new DieRange(0,0), new DieRange(1,1));
            ap.econTurn = rowId;
            ap.difficultyIncrement = difficulty;

            ap = service.rollEcon(ap, econRollTable, dieHelper);
            expect(ap.defense).toBe(rolls * difficulty * 2);

            spy.mockRestore();
        });
        
        it ( 'correctly affects the econTable when econ rolls are invoked by roll', () => {
            const spy =
                jest.spyOn(dieHelper, 'd10' ).mockImplementation(() => 1);

            const rowId = rand(10);
            const rolls = rand(10, 1);
            econRollTable.rows[rowId] = new EconRollTableRow(rolls, new DieRange(0,0), new DieRange(0,0), new DieRange(0,0), new DieRange(1,1));
            ap.econTurn = rowId;

            ap = service.rollEcon(ap, econRollTable, dieHelper);
            expect(econRollTable.rows[rowId + 3].extraEcon).toBe(rolls)

            spy.mockRestore();
        });
    });

    describe( 'rollFleet', () => {

        let ap;
        let fleetLaunchTable;
        let dieHelper;
        let humanState;
        let apFleetHelper;
        let humanCompareHelper;

        beforeEach( () => {
            fleetLaunchTable = new FleetLaunchTable();
            dieHelper = new DieHelper();
            ap = new AP(1, 5);
            humanState = new HumanState();
            apFleetHelper = new ApFleetHelper();
            humanCompareHelper = new ApAndHumanComparisonHelper();

            jest.spyOn(apFleetHelper, 'generateNewFleet').mockImplementation((ap, humanState, compareHelper, dieHelper) => {
                const fleet = new ApFleet();
                fleet.cp = ap.fleet;
                ap.fleet = 0;
                ap.currentFleets.push(fleet);
            })
        });

        it( 'generates a new fleet for the AP, when appropriate', () => {

            const spy=
                jest.spyOn(dieHelper, 'd10' ).mockImplementation(() => 5);

            let rowId = rand(19, 1);
            const numDieRolls = rand(10, 1);
            ap.fleet = 0;

            for( let i = 0 ; i < numDieRolls ; i++ ) {

                ap.fleet +=100;
                fleetLaunchTable.rows[rowId] = new DieRange(5,5);
                ap.econTurn = rowId;
                const fleetGenerated = service.rollFleet( ap, fleetLaunchTable, humanState, dieHelper, apFleetHelper, humanCompareHelper);
                expect(fleetGenerated).toBe(true);
            }

            expect(ap.currentFleets.length).toBe(numDieRolls);
            ap.currentFleets.forEach((fleet) => {
                expect(fleet.cp).toBe(100);
            })
        });

        it( 'declines to generate a new fleet for the AP, when appropriate', () => {
            const spy=
                jest.spyOn(dieHelper, 'd10' ).mockImplementation(() => 9);

            let rowId = rand(19, 1);
            const numDieRolls = rand(10, 1);
            ap.fleet = 0;

            for( let i = 0 ; i < numDieRolls ; i++ ) {

                ap.fleet +=100;
                fleetLaunchTable.rows[rowId] = new EconRollTableRow(1, new DieRange(5,5), new DieRange(0,0));
                ap.econTurn = rowId;
                const fleetGenerated = service.rollFleet( ap, fleetLaunchTable, humanState, dieHelper, apFleetHelper, humanCompareHelper);
                expect(fleetGenerated).toBe(false);
            }

            expect(ap.currentFleets.length).toBe(0);
        })

        it ( 'respects an empty fleet launch range on the given econ table row', () => {
            const spy=
                jest.spyOn(dieHelper, 'd10' ).mockImplementation(() => 9);

            let rowId = rand(19, 1);
            const numDieRolls = rand(10, 1);
            ap.fleet = 0;

            for( let i = 0 ; i < numDieRolls ; i++ ) {

                ap.fleet +=100;
                fleetLaunchTable.rows[rowId] = new EconRollTableRow(1, null, new DieRange(0,0));
                ap.econTurn = rowId;
                const fleetGenerated = service.rollFleet( ap, fleetLaunchTable, humanState, dieHelper, apFleetHelper, humanCompareHelper);
                expect(fleetGenerated).toBe(false);
            }

            expect(ap.currentFleets.length).toBe(0);
        });

        it ( 'accounts for scenario: Reduce roll by 2 if AP has superior Fighters against human Point Defense & sufficient fleet size.', () => {
            const spy1 = jest.spyOn(humanCompareHelper, 'isHumanPointDefenseInferiorToApFighters' ).mockImplementation( (ap, humanState) => true);
            const spy2 = jest.spyOn(dieHelper, 'd10' ).mockImplementation(() => 6);

            let rowId = rand(19, 1);
            const numDieRolls = rand(10, 1);
            ap.fleet = 0;
            ap.econTurn = rowId;
            fleetLaunchTable.rows[rowId] = new DieRange(5,5);

            expect(service.rollFleet(ap, fleetLaunchTable, humanState, dieHelper, apFleetHelper, humanCompareHelper)).toBe(false);

            ap.fleet = 100;
            expect(service.rollFleet(ap, fleetLaunchTable, humanState, dieHelper, apFleetHelper, humanCompareHelper)).toBe(false);

            jest.spyOn(dieHelper, 'd10' ).mockImplementation(() => 7);
            expect(service.rollFleet(ap, fleetLaunchTable, humanState, dieHelper, apFleetHelper, humanCompareHelper)).toBe(true);
        });

        it ( 'accounts for scenario: Reduce roll by 2 if ap has superior cloaking compared to human scanner tech & sufficient fleet size.', () => {
            jest.spyOn(humanCompareHelper, 'isHumanScannersInferiorToApCloaking' ).mockImplementation( (ap, humanState) => true);
            jest.spyOn(dieHelper, 'd10' ).mockImplementation(() => 6);

            let rowId = rand(19, 1);
            const numDieRolls = rand(10, 1);
            ap.fleet = 0;
            ap.econTurn = rowId;
            fleetLaunchTable.rows[rowId] = new DieRange(5,5);

            expect(service.rollFleet(ap, fleetLaunchTable, humanState, dieHelper, apFleetHelper, humanCompareHelper)).toBe(false);

            ap.fleet = 100;
            expect(service.rollFleet(ap, fleetLaunchTable, humanState, dieHelper, apFleetHelper, humanCompareHelper)).toBe(false);

            jest.spyOn(dieHelper, 'd10' ).mockImplementation(() => 7);
            expect(service.rollFleet(ap, fleetLaunchTable, humanState, dieHelper, apFleetHelper, humanCompareHelper)).toBe(true);
        });
    });

    describe( 'roll for movement upgrade', () => {

        let ap;
        let dieHelper;
        let buyApTechUpgrade = ApQuery.getInstance().buyApTechUpgrade;

        beforeEach(() => {
            ap = new AP();
            dieHelper = new DieHelper();
        });

        afterEach(() => {
            ApQuery.resetInstance();
        });

        it( 'upgrades movement when appropriate', () => {

            jest.spyOn( dieHelper, 'd10' ).mockImplementation(() => rand(4, 1) );
            const apQuery = ApQuery.getInstance();
            const numberOfTries = rand(20, 10);
            ap.purchasedTech = [];

            for( let i = 0 ; i < numberOfTries ; i++ ) {

                jest.spyOn(apQuery, 'buyApTechUpgrade').mockImplementationOnce((name, ap) => {
                    if ( ap.purchasedTech.length > 0 ) {
                        ap.purchasedTech[0].level++;
                    } else {
                        const tech = new AppliedTech();
                        tech.level += 1;
                        tech.name = 'move';
                        ap.purchasedTech.push( tech );
                    }
                });

                service.rollForMovementUpgrade(ap, dieHelper);
            }

            expect(ap.purchasedTech[0].name).toBe('move');
            expect(ap.purchasedTech[0].level).toBe(numberOfTries);

            jest.spyOn( dieHelper, 'd10' ).mockImplementation(() => rand(10, 6) );
            ap.purchasedTech = [];

            for( let i = 0 ; i < numberOfTries ; i++ ) {

                jest.spyOn(apQuery, 'buyApTechUpgrade').mockImplementationOnce((name, ap) => {
                    expect(true).toBe(false);
                });

                service.rollForMovementUpgrade(ap, dieHelper);
            }

            expect(ap.purchasedTech.length).toBe(0);
        });
    });

    describe( 'releaseFleet', () => {

        let ap;
        let techHelper;
        let fleetHelper;
        let humanState;

        beforeEach( () => {
            ap = new AP(1, 5);
            techHelper = new ApTechHelper();
            fleetHelper = new ApFleetHelper();
            humanState = new HumanState();

            ap.currentFleets = [new ApFleet()];
            ap.fleet = 0;
            ap.currentFleets[0].cp = 50;
            ap.currentFleets[0].ships = 0;
            ap.currentFleets[0].isRaider = false;
        });

        it( 'considers upgrading tech and buying ships', () => {
            jest.spyOn(techHelper, 'upgradeApTech').mockImplementation((humanState, ap) => {
                ap.techUpgradeConsidered = true;
                return ap;
            });

            jest.spyOn(fleetHelper, 'buyShips').mockImplementation((fleet, humanState, ap, oldAp) => {
                ap.shipsBought = true;
                return ap;
            });

            const newAp = service.releaseFleet(0, humanState, ap, fleetHelper, techHelper);
            expect(newAp.techUpgradeConsidered).toBe(true);
            expect(newAp.shipsBought).toBe(true);
        });

        it( 'returns the AP (clone) with the populated fleet', () => {

            jest.spyOn(fleetHelper, 'buyShips').mockImplementation((fleet, humanState, ap, oldAp) => {
                fleet.ships = [new ShipTemplate('SC', 'Scout', 6, 'E', 1, 1, 1)];
                return ap;
            });

            const newAp = service.releaseFleet(0, humanState, ap, fleetHelper, techHelper);
            expect(newAp.currentFleets[0].ships[0].name).toBe('Scout');
        });

        it( 'adds the remainder of unspent fleet CP back to the AP\'s fleet budget', () => {
            const fleetDeduction = rand(20, 40);

            jest.spyOn(fleetHelper, 'buyShips').mockImplementation((fleet, humanState, ap, oldAp) => {
                fleet.cp -= fleetDeduction;
                fleet.ships = [new ShipTemplate('SC', 'Scout', 6, 'E', 1, 1, 1)];
                return ap;
            });

            const newAp = service.releaseFleet(0, humanState, ap, fleetHelper, techHelper);
            expect(newAp.fleet).toBe(50 - fleetDeduction);
        });
    });

    describe( 'releaseDefenseFleet', () => {

        let humanState, ap, dieHelper, comparisonHelper, defenseHelper, fleetHelper, techHelper;

        beforeEach(() => {
            humanState = new HumanState();
            ap = new AP();
            dieHelper = new DieHelper();
            comparisonHelper = new ApAndHumanComparisonHelper()
            defenseHelper = new ApDefenseFleetHelper()
            fleetHelper = new ApFleetHelper();
            techHelper = new ApTechHelper();

            ap.defense = 1000;
        });

        it ( 'generates a new fleet', () => {
            jest.spyOn(defenseHelper, 'generateNewFleet').mockImplementation((ap, humanState, comparisonHelper, dieHelper) => {
                ap.isNewFleetGenerated = true;
                return new ApFleet();
            });

            service.releaseDefenseFleet(humanState, ap, dieHelper, comparisonHelper, defenseHelper, fleetHelper, techHelper);
            expect(ap.isNewFleetGenerated).toBe(true);
        });

        it('considers a defensive AP Tech Upgrade', () => {

            jest.spyOn( techHelper, 'upgradeApTech').mockImplementation((humanState, ap, isDefenseUpgrade) => {
                expect(isDefenseUpgrade).toBe(true);
                ap.isUpgradeApTechCalled = true;
            });

            service.releaseDefenseFleet(humanState, ap, dieHelper, comparisonHelper, defenseHelper, fleetHelper, techHelper);
            expect(ap.isUpgradeApTechCalled).toBe(true);
        });

        it( 'launches the new defensive fleet', () => {

            jest.spyOn(defenseHelper, 'launchDefensiveFleet').mockImplementation((ap, fleet, dieHelper) => {
                ap.isLaunchDefensiveFleetCalled = true;
            });

            service.releaseDefenseFleet(humanState, ap, dieHelper, comparisonHelper, defenseHelper, fleetHelper, techHelper);
            expect(ap.isLaunchDefensiveFleetCalled).toBe(true);
        });

        it( 'buys new ships for the fleet (not raiders)', () => {
            jest.spyOn(fleetHelper, 'buyShips').mockImplementation((fleet, humanSTate, ap, oldAp, isRaidersAllowed) => {
                expect(isRaidersAllowed).toBe(false);
                ap.isBuyShipsCalled = true;
            });

            service.releaseDefenseFleet(humanState, ap, dieHelper, comparisonHelper, defenseHelper, fleetHelper, techHelper);
            expect(ap.isBuyShipsCalled).toBe(true);
        });

        it( 'adds new fleet to AP', () => {
            ap.currentFleets = [];
            jest.spyOn(defenseHelper, 'generateNewFleet').mockImplementation((ap, humanState, comparisonHelper, dieHelper) => {
                return new ApFleet();
            });


            service.releaseDefenseFleet(humanState, ap, dieHelper, comparisonHelper, defenseHelper, fleetHelper, techHelper);
            expect(ap.currentFleets.length).toBe(1);
        });
    });
});