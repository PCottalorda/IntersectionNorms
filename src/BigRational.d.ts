/**
 * Type definitions for BigInteger.js
 * Definitions by: Tommy Frazier <https://github.com/toefraz>
 */
export = bigInt;
export as namespace bigInt;

declare var bigInt: bigInt.BigIntegerStatic;

declare namespace bigInt {
    
	type BigNumber = number | string | BigInteger;

    interface BigIntegerStatic {
        /**
         * Equivalent to bigRat(0).
         */
        (): BigRational;

        /**
         * Parse a Javascript number into a bigRat.
         */
        (number: number): BigRational;

        /**
         * Parse a BigInteger into a BigRational.
         */
        (number: BigInteger): BigRational;

        /**
         * Parse a string into a bigRat.
		 * The strings may be :
		 *     - an integer such as "12345"
		 *     - a numerator over a denominator such as "2/3"
		 *     - a mixed fraction such as "1_1/2"
		 *     - a decimal number such as "54.05446"
         */
        (string: string): BigInteger;

        /**
         * no-op.
         */
        (bigInt: BigRational): BigRational;

		/**
		 * Parse a pair (numerator, denominator) into a bigRat
		 * Both parameter must be one of the following:
		 *     - a string in integer form, such as "12345"
		 *     - a Javascript number that is an integer, such as 12345
		 *     - a BigInteger
		 */
		(num: BigNumber, denom: BigNumber): BigRational;

        /**
         * Equivalent to bigRat(-1).
         */
        minusOne: BigRational;

        /**
         * Equivalent to bigRat(1).
         */
        one: BigRational;


        /**
         * Equivalent to bigRat(0).
         */
        zero: BigRational;
    }

    interface BigRational {
		
		/**
		 * Returns the numerator of a bigRational. This will be a bigInt.
		 */
		numerator: BigInteger;
		
		/**
		 * Returns the denominator of a bigRational. This will be a bigInt.
		 */
		denominator: BigInteger;
		
		/**
		 * Alias for the numerator property
		 */
		num: BigInteger;
		
		/**
		 * Alias for the denominator property
		 */
		denom: BigInteger;
		
        /**
         * Returns the absolute value of a bigRat.
         */
        abs(): BigRational;

        /**
         * Performs addition.
         */
        add(num: BigNumber, denom: BigNumber): BigRational;
		
		/**
         * Performs addition.
         */
        add(number : BigRational): BigRational;
		
		/**
		 * Rounds up to the nearest integer. If the toBigInt argument is true, then it will return a bigInteger instead of a bigRational.
		 */
		ceil(toBigInt?: boolean): BigRational | BigInteger;

        /**
         * Performs a comparison between two numbers. If the numbers are equal, it returns 0.
         * If the first number is greater, it returns 1. If the first number is lesser, it returns -1.
         */
        compare(number: BigNumber): number;
		
        /**
         * Performs a comparison between two numbers. If the numbers are equal, it returns 0.
         * If the first number is greater, it returns 1. If the first number is lesser, it returns -1.
         */
        compare(number: BigRational): number;
		
	     /**
         * Performs a comparison between two numbers. If the numbers are equal, it returns 0.
         * If the first number is greater, it returns 1. If the first number is lesser, it returns -1.
         */
        compare(num: BigNumber, denom: BigNumber): number;

        /**
         * Performs a comparison between the absolute value of the two numbers. If the numbers are equal, it returns 0.
         * If the first number is greater, it returns 1. If the first number is lesser, it returns -1.
         */
        compareAbs(number: BigNumber): number;
		
        /**
         * Performs a comparison between the absolute value of the two numbers. If the numbers are equal, it returns 0.
         * If the first number is greater, it returns 1. If the first number is lesser, it returns -1.
         */
        compareAbs(number: BigRational): number;
		
	     /**
         * Performs a comparison between the absolute value of the two numbers. If the numbers are equal, it returns 0.
         * If the first number is greater, it returns 1. If the first number is lesser, it returns -1.
         */
        compareAbs(num: BigNumber, denom: BigNumber): number;

		/**
         * Alias for the compare method.
         */
        compareTo(number: BigNumber): number;
		
        /**
         * Alias for the compare method.
         */
        compareTo(number: BigRational): number;
		
	     /**
         * Alias for the compare method.
         */
        compareTo(num: BigNumber, denom: BigNumber): number;

        /**
         * Performs rational division.
         */
        divide(number: BigNumber): BigRational;
		
		/**
         * Performs rational division.
         */
        divide(number: BigRational): BigRational;
		
		/**
         * Performs rational division.
         */
        divide(num: BigNumber, denom: BigNumber): BigRational;

        /**
         * Alias for the equals method.
         */
        eq(number: BigNumber): boolean;
		
		/**
         * Alias for the equals method.
         */
        eq(number: BigRational): boolean;
		
		/**
         * Alias for the equals method.
         */
        eq(num: BigNumber, denom: BigNumber): boolean;

        /**
         * Checks if two numbers are equal.
         */
        equals(number: BigNumber): boolean;
		
		/**
         * Checks if two numbers are equal.
         */
        equals(number: BigRational): boolean;
		
		/**
         * Checks if two numbers are equal.
         */
        equals(num: BigNumber, denom: BigNumber): boolean;

		/**
		 * Rounds down to the nearest integer. If the toBigInt argument is true, then it will return a bigInteger instead of a bigRational.
		 */
		floor(toBigInt?: boolean) : BigInteger | BigRational;
		
		/**
         * Alias for the greaterOrEquals method.
         */
        geq(number: BigNumber): boolean;
		
		/**
         * Alias for the greaterOrEquals method.
         */
        geq(number: BigRational): boolean;
		
		/**
         * Alias for the greaterOrEquals method.
         */
        geq(num: BigNumber, denom: BigNumber): boolean;
		
		/**
         * Checks if the first number is greater than the second.
         */
        greater(number: BigNumber): boolean;
		
		/**
         * Checks if the first number is greater than the second.
         */
        greater(number: BigRational): boolean;
		
		/**
         * Checks if the first number is greater than the second.
         */
        greater(num: BigNumber, denom: BigNumber): boolean;

        /**
         * Checks if the first number is greater than or equal to the second.
         */
        greaterOrEquals(number: BigNumber): boolean;
		
		/**
         * Checks if the first number is greater than or equal to the second.
         */
        greaterOrEquals(number: BigRational): boolean;
		
		/**
         * Checks if the first number is greater than or equal to the second.
         */
        greaterOrEquals(num: BigNumber, denom: BigNumber): boolean;

        /**
         * Alias for the greater method.
         */
        gt(number: BigNumber): boolean;
		
		/**
         * Alias for the greater method.
         */
        gt(number: BigRational): boolean;
		
		/**
         * Alias for the greater method.
         */
        gt(num: BigNumber, denom: BigNumber): boolean;

        /**
         * Returns true if the number is negative, false otherwise.
         * Returns false for 0 and true for -0.
         */
        isNegative(): boolean;

        /**
         * Return true if the number is positive, false otherwise.
         * Returns true for 0 and false for -0.
         */
        isPositive(): boolean;

        /**
         * Return true if the number is 0 or -0, false otherwise.
         */
        isZero(): boolean;

        /**
         * Alias for the lesserOrEquals method.
         */
        leq(number: BigNumber): boolean;
		
		/**
         * Alias for the lesserOrEquals method.
         */
        leq(number: BigRational): boolean;
		
		/**
         * Alias for the lesserOrEquals method.
         */
        leq(num: BigNumber, denom: BigNumber): boolean;

        /**
         * Checks if the first number is lesser than the second.
         */
        lesser(number: BigNumber): boolean;
		
		/**
         * Checks if the first number is lesser than the second.
         */
        lesser(number: BigRational): boolean;
		
		/**
         * Checks if the first number is lesser than the second.
         */
        lesser(num: BigNumber, denom: BigNumber): boolean;

        /**
         * Checks if the first number is less than or equal to the second.
         */
        lesserOrEquals(number: BigNumber): boolean;
		
		/**
         * Checks if the first number is less than or equal to the second.
         */
        lesserOrEquals(number: BigRational): boolean;
		
		/**
         * Checks if the first number is less than or equal to the second.
         */
        lesserOrEquals(num: BigNumber, denom: BigNumber): boolean;

        /**
         * Alias for the lesser method.
         */
        lt(number: BigNumber): boolean;
		
		/**
         * Alias for the lesser method.
         */
        lt(number: BigRational): boolean;
		
		/**
         * Alias for the lesser method.
         */
        lt(num: BigNumber, denom: BigNumber): boolean;

        /**
         * Alias for the subtract method.
         */
        minus(number: BigNumber): BigInteger;

        /**
         * Performs division and returns the remainder, disregarding the quotient.
         * The sign of the remainder will match the sign of the dividend.
         */
        mod(number: BigNumber): BigInteger;

        /**
         * Finds the multiplicative inverse of the number modulo mod.
         */
        modInv(number: BigNumber): BigInteger;

        /**
         * Takes the number to the power exp modulo mod.
         */
        modPow(exp: BigNumber, mod: BigNumber): BigInteger;

        /**
         * Performs multiplication.
         */
        multiply(number: BigNumber): BigInteger;

        /**
         * Reverses the sign of the number.
         */
        negate(): BigInteger;

        /**
         * Alias for the notEquals method.
         */
        neq(number: BigNumber): boolean;

        /**
         * Adds one to the number.
         */
        next(): BigInteger;

        /**
         * Performs the bitwise NOT operation.
         */
        not(): BigInteger;

        /**
         * Checks if two numbers are not equal.
         */
        notEquals(number: BigNumber): boolean;

        /**
         * Performs the bitwise OR operation.
         */
        or(number: BigNumber): BigInteger;

        /**
         * Alias for the divide method.
         */
        over(number: BigNumber): BigInteger;

        /**
         * Alias for the add method.
         */
        plus(number: BigNumber): BigInteger;

        /**
         * Performs exponentiation. If the exponent is less than 0, pow returns 0.
         * bigInt.zero.pow(0) returns 1.
         */
        pow(number: BigNumber): BigInteger;

        /**
         * Subtracts one from the number.
         */
        prev(): BigInteger;

        /**
         * Alias for the mod method.
         */
        remainder(number: BigNumber): BigInteger;

        /**
         * Shifts the number left by n places in its binary representation.
         * If a negative number is provided, it will shift right.
         *
         * Throws an error if number is outside of the range [-9007199254740992, 9007199254740992].
         */
        shiftLeft(number: BigNumber): BigInteger;

        /**
         * Shifts the number right by n places in its binary representation.
         * If a negative number is provided, it will shift left.
         *
         * Throws an error if number is outside of the range [-9007199254740992, 9007199254740992].
         */
        shiftRight(number: BigNumber): BigInteger;

        /**
         * Squares the number.
         */
        square(): BigInteger;

        /**
         * Performs subtraction.
         */
        subtract(number: BigNumber): BigInteger;

        /**
         * Alias for the multiply method.
         */
        times(number: BigNumber): BigInteger;

        /**
         *
         * Converts a bigInt to an object representing it as an array of integers module the given radix.
         */
        toArray(radix: number): BaseArray;

        /**
         * Converts a bigInt into a native Javascript number. Loses precision for numbers outside the range.
         */
        toJSNumber(): number;

        /**
         * Converts a bigInt to a string.
         */
        toString(radix?: number, alphabet?: string): string;

		/**
         * Converts a bigInt to a string. This method is called behind the scenes in JSON.stringify.
         */
        toJSON(): string;

        /**
         * Converts a bigInt to a native Javascript number. This override allows you to use native
         * arithmetic operators without explicit conversion.
         */
        valueOf(): number;

        /**
         * Performs the bitwise XOR operation.
         */
        xor(number: BigNumber): BigInteger;
    }

}
