/**
 * Type definitions for BigRational.js
 * Definitions by: Paul Cottalorda <https://github.com/PCottalorda>
 */
export = bigRat;
export as namespace bigRat;

declare var bigRat: bigRat.BigRationalStatic;

declare namespace bigRat {
    
	type BigNumber = number | string | BigRational;

    interface BigRationalStatic {
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
        (string: string): BigRational;

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
		 * Rounds down to the nearest integer. If the toBigInt argument
		 * is true, then it will return a bigInteger instead of a bigRational.
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
        minus(number: BigNumber): BigRational;
		
		/**
         * Alias for the subtract method.
         */
        minus(number: BigRational): BigRational;
		
		/**
         * Alias for the subtract method.
         */
        minus(num: BigNumber, denom: BigNumber): BigRational;

        /**
         * Performs the modulo operation
         */
        mod(number: BigNumber): BigRational;
		
		/**
         * Performs the modulo operation
         */
        mod(number: BigRational): BigRational;
		
		/**
         * Performs the modulo operation
         */
        mod(num: BigNumber, denom: BigNumber): BigRational;

        /**
         * Performs multiplication.
         */
        multiply(number: BigNumber): BigRational;
		
		/**
         * Performs multiplication.
         */
        multiply(number: BigRational): BigRational;
		
		/**
         * Performs multiplication.
         */
        multiply(num: BigNumber, denom: BigNumber): BigRational;

        /**
         * Reverses the sign of the number.
         */
        negate(): BigRational;

        /**
         * Alias for the notEquals method.
         */
        neq(number: BigNumber): boolean;
		
		/**
         * Alias for the notEquals method.
         */
        neq(number: BigRational): boolean;
		
		/**
         * Alias for the notEquals method.
         */
        neq(num: BigNumber, denom: BigNumber): boolean;

        /**
         * Checks if two numbers are not equal.
         */
        notEquals(number: BigNumber): boolean;
		
		/**
         * Checks if two numbers are not equal.
         */
        notEquals(number: BigRational): boolean;
		
		/**
         * Checks if two numbers are not equal.
         */
        notEquals(num: BigNumber, denom: BigNumber): boolean;

        /**
         * Alias for the divide method.
         */
        over(number: BigNumber): BigRational;
		
		/**
         * Alias for the divide method.
         */
        over(number: BigRational): BigRational;
		
		/**
         * Alias for the divide method.
         */
        over(num: BigNumber, denom: BigNumber): BigRational;

        /**
         * Alias for the add method.
         */
        plus(number: BigNumber): BigRational;
		
		/**
         * Alias for the add method.
         */
        plus(number: BigRational): BigRational;
		
		/**
         * Alias for the add method.
         */
        plus(num: BigNumber, denom: BigNumber): BigRational;

        /**
         * Performs exponentiation. The argument is parsed as a bigInt
         */
        pow(number: BigNumber): BigRational;

        /**
         * Returns the reciprocal of a number
         */
        reciprocate(): BigRational;

		/**
		 * Rounds a number to the nearest integer.
		 * If the number is exactly half-way between two integers, it will round up.
		 * If the toBigInt argument is true, then it will return a bigInteger instead of a bigRational.
         */
        round(toBigInt?: boolean): BigInteger | BigRational;

        /**
         * Performs subtraction.
         */
        subtract(number: BigNumber): BigRational;
		
		/**
         * Performs subtraction.
         */
        subtract(number: BigRational): BigRational;
		
		/**
         * Performs subtraction.
         */
        subtract(num: BigNumber, denom: BigNumber): BigRational;

        /**
         * Alias for the multiply method.
         */
        times(number: BigNumber): BigRational;
		
		/**
         * Alias for the multiply method.
         */
        times(number: BigRational): BigRational;
		
		/**
         * Alias for the multiply method.
         */
        times(num: BigNumber, denom: BigNumber): BigRational;

        /**
         * Converts a bigRational to a string in decimal notation, cut off after
		 * the number of digits specified in the digits argument.
		 * The default number of digits is 10.
         */
        toDecimal(digits?: number): String

        /**
         * Converts a bigRat to a string in "numerator/denominator" notation.
         */
        toString(): string;

        /**
         * Converts a bigRat to a native Javascript number.
		 * This override allows you to use native arithmetic operators without
		 * explicit conversion:
         */
        valueOf(): number;

    }

}
