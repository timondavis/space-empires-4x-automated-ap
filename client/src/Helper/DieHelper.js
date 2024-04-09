export class DieHelper {
    d10 = () => {
        return this.nd10(1);
    }

    /**
     * Roll n d10 and return result
     *
     * @param n : number
     *
     * @return {number}
     */
    nd10 = (n) => {
        if ( n < 1 ) { return 0; }

        let result = 0;
        for ( let i = 0 ; i < n ; i++ ) {
            result += Math.floor(Math.random() * 10 ) + 1;
        }

        return result;
    }

    /**
     * Is rolled number in die range?
     *
     * @param number
     * @param dieRange : DieRange
     */
    isNumberInRange = ( number, dieRange ) => {
        if ( ! dieRange ) {
            return false;
        }

        return (number >= dieRange.min && number <= dieRange.max );
    }
}