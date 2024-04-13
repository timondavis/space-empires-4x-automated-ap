import { ApDecisionService } from './ApDecisionService';
import {AP} from "../../Model/AP";
import {FleetLaunchTable} from "../../Model/FleetLaunchTable";
import {HumanState} from "../../Model/HumanState";
import {DieHelper} from "../../Helper/DieHelper/DieHelper";
import {EconRollTable} from "../../Model/EconRollTable";
import {EconRollTableRow} from "../../Model/EconRollTableRow";
import {DieRange} from "../../Model/DieRange";

describe('ApDecisionService', () => {
    /**
     * @type ApDecisionService
     */
    let service;

    beforeEach(() => {
        service = ApDecisionService.getInstance();
    });

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

                let numDieRolls = Math.floor(Math.random() * 20) + 1;
                let rowId = Math.floor(Math.random() * 19) + 1;

                econRollTable.rows[rowId] = new EconRollTableRow(numDieRolls, new DieRange(5,5), new DieRange(0,0));
                ap.econTurn = rowId;

                ap = service.rollEcon(ap, econRollTable, dieHelper);

                expect(ap.fleet).toBe(numDieRolls);
                ap.fleet = 0;
            }
        });

        it ( 'correctly assigns points to fleet CP', () => {

        });

        it ( 'correctly assigns points to tech CP', () => {

        });

        it ( 'correctly assigns points to defense CP', () => {

        });
        
        it ( 'correctly ')

    });

    // The same would go for rollFleet, releaseFleet, and releaseDefenseFleet
});