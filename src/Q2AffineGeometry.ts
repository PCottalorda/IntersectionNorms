import BigRational = bigRat.BigRational

/**
 * Represent a point in Q^2 seen as an affine space
 */
class Q2Point {
	
	x: BigRational;
	y: BigRational;
	
	constructor(x: BigRational, y: BigRational) {	
		this.x = x;
		this.y = y;
	}
	
	/**
	 * Equality operator
	 */
	equals(p : Q2Point): boolean {
		return this.x.equals(p.x) && this.y.equals(p.y)
	}
	
};

/**
 * Respresents a vector in Q^2 seen as an affine space
 */
class Q2Vector {
	
	x : BigRational
	y : BigRational
	
	
	constructor(x: BigRational, y: BigRational) {
		this.x = x
		this.y = y
	}
	
	/**
	 * Construct a vector from two points.
	 * In affine geometry it corresponds to the vector p1 - p0
	 */
	static fromPoints(p0: Q2Point, p1: Q2Point) {
		return new Q2Vector(p1.x.minus(p0.x), p1.y.minus(p0.y));
	}
	
	/**
	 * Addition of vectors in Q^2
	 */
	plus(v: Q2Vector): Q2Vector {
		return new Q2Vector(this.x.plus(v.x), this.y.plus(v.y));
	}
	
	/**
	 * Substraction of vectors in Q^2
	 */
	minus(v: Q2Vector): Q2Vector {
		return new Q2Vector(this.x.minus(v.x), this.y.minus(v.y));
	}

	/**
	 * Canonical dot product of vectors in Q^2
	 */
	dot(v: Q2Vector): BigRational {
		return (this.x.multiply(v.x)).add(this.y.multiply(v.y));
	}
	
	/**
	 * Equality operator
	 */
	equals(v: Q2Vector): boolean {
		return this.x.equals(v.x) && this.y.equals(v.y);
	}
}

/**
 * Respresents an oriented segment in Q^2
 */
class Q2Segment {
	
	p0 : Q2Point
	p1 : Q2Point
	
	/**
	 * Construct an oriented segment from two points in Q^2
	 *
	 * If the points are the same, an exception is thrown
	 */
	constructor(p0 : Q2Point, p1 : Q2Point) {
		if (p0.equals(p1)) {
			throw "A segment cannot be empty"
		}
		this.p0 = p0;
		this.p1 = p1;
	}
	
	/**
	 * The vector underlying the segment, i.e. the vector v such that p1 = p0 + vLinkcolor
	 */
	vec(): Q2Vector {
		return Q2Vector.fromPoints(this.p0, this.p1);
	}
	
	/**
	 * Equality operator
	 */
	equals(s : Q2Segment): boolean {
		return (this.p0.equals(s.p0) && this.p1.equals(s.p1));
	}
}

