import {ApAndHumanComparisonHelper} from "./ApAndHumanComparisonHelper";
import {AP} from "../../Model/AP";
import {HumanState} from "../../Model/HumanState";
import {ApQuery} from "../../Service/ApQuery/ApQuery";

/**
 * @type ApAndHumanComparisonHelper
 */
describe( 'ApAndHumanComparisonHelper', () => {

    const helper = new ApAndHumanComparisonHelper();

    let ap;
    let humanState;

    beforeEach(() => {
        ap = new AP();
        humanState = new HumanState();
        ApQuery.resetInstance();
    });

    describe('isHumanPointDefenseInferiorToApFighters', () => {

        it('accurately reports whether the a given human\'s DEMONSTRATED ' +
            'Point Defense tech is inferior to the Ap\'s Point Defense tech', () => {

            let apQuery = ApQuery.getInstance();
            jest.spyOn(apQuery, 'getApTechLevel').mockImplementation((name, ap) => 0 );
            humanState.isHumanShowedPointDefense = false;
            humanState.humanPointDefenseLevel = 0;

            expect(helper.isHumanPointDefenseInferiorToApFighters(ap, humanState)).toBe(false);

            jest.spyOn(apQuery, 'getApTechLevel').mockImplementation((name, ap) => 1 );
            expect(helper.isHumanPointDefenseInferiorToApFighters(ap, humanState)).toBe(true);

            humanState.isHumanShowedPointDefense = true;
            expect(helper.isHumanPointDefenseInferiorToApFighters(ap, humanState)).toBe(true);

            humanState.humanPointDefenseLevel = 2;
            expect(helper.isHumanPointDefenseInferiorToApFighters(ap, humanState)).toBe(false);

            humanState.isHumanShowedPointDefense = false;
            expect(helper.isHumanPointDefenseInferiorToApFighters(ap, humanState)).toBe(true);

            humanState.isHumanShowedPointDefense = true;
            jest.spyOn(apQuery, 'getApTechLevel').mockImplementation((name, ap) => 2 );
            expect(helper.isHumanPointDefenseInferiorToApFighters(ap, humanState)).toBe(false);

            jest.spyOn(apQuery, 'getApTechLevel').mockImplementation((name, ap) => 3 );
            expect(helper.isHumanPointDefenseInferiorToApFighters(ap, humanState)).toBe(true);

        });
    });

    describe( 'isHumanScannersInferiorToApCloaking', () => {

        it( 'accurately reports on whether the Human Player\'s scanners are inferior to that of the AP.', () => {

            let apQuery = ApQuery.getInstance();
            jest.spyOn(apQuery, 'getApTechLevel').mockImplementation((name, ap) => 0 );
            humanState.isHumanHasScannerTech = false;
            humanState.humanScannerlevel = 0;

            expect(helper.isHumanScannersInferiorToApCloaking(ap, humanState)).toBe(false);

            humanState.humanScannerLevel = 1;
            expect(helper.isHumanScannersInferiorToApCloaking(ap, humanState)).toBe(false);

            jest.spyOn(apQuery, 'getApTechLevel').mockImplementation((name, ap) => 1 );
            expect(helper.isHumanScannersInferiorToApCloaking(ap, humanState)).toBe(true);

            humanState.isHumanHasScannerTech = true;
            expect(helper.isHumanScannersInferiorToApCloaking(ap, humanState)).toBe(false);

            jest.spyOn(apQuery, 'getApTechLevel').mockImplementation((name, ap) => 2 );
            expect(helper.isHumanScannersInferiorToApCloaking(ap, humanState)).toBe(true);
        })
    });
});