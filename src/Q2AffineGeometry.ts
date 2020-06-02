/**
 * This file provides tools useful to do affine geometry
 * it is meant in the project to be use to construct the
 * graph related to the lacet in the geometry
 */
 
const bigRat = require('big-rational');
import BigRational = bigRat.BigRational;

/**
 * Represent a point in Q^2 seen as an affine space
 */
export class Q2Point {
	
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
export class Q2Vector {
	
	x : BigRational;
	y : BigRational;
	
	
	constructor(x: BigRational, y: BigRational) {
		this.x = x;
		this.y = y;
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
		return (this.x.times(v.x)).add(this.y.times(v.y));
	}
	
	/**
	 * Computes the determinant
	 *
	 *		| this.x	v.x |
	 *		| this.y	v.y |
	 */
	determinant(v: Q2Vector): BigRational {
		return (this.x.times(v.y)).minus(this.y.times(v.x));
	}
	
	/**
	 * Alias for the determinant
	 */
	det(v: Q2Vector) : BigRational {
		return this.determinant(v);
	}
	
	/**
	 * Equality operator
	 */
	equals(v: Q2Vector): boolean {
		return this.x.equals(v.x) && this.y.equals(v.y);
	}
	
	/**
	 * Returns true if the vector is colinear to vLinkcolor
	 *
	 * Warning : It is to be remembered that zero is colinear to every vectors
	 */
	colinearTo(v: Q2Vector) : boolean {
		return this.det(v).equals(bigRat.zero); // Checks if the cross product is null
	}
}

export class NoIntersection {}



/**
 * Respresents an oriented segment in Q^2
 */
export class Q2Segment {
	
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
	equals(s: Q2Segment): boolean {
		return (this.p0.equals(s.p0) && this.p1.equals(s.p1));
	}
	
	/**
	 * Checks if the point is aligned with the segment
	 */
	alignedWithPoint(p: Q2Point): boolean {
		return this.vec().colinearTo(Q2Vector.fromPoints(this.p0, p));
	}
	
	/**
	 * Checks if both segments are aligned
	 */
	alignedWithSegment(s: Q2Segment) : boolean {
		return this.alignedWithPoint(s.p0) && this.alignedWithPoint(s.p1);
	}
	
	/**
	 * Checks if the point given is contained in the segment
	 */
	contains(p: Q2Point) : boolean {
		return this.alignedWithPoint(p) && Q2Vector.fromPoints(this.p0, p).dot(Q2Vector.fromPoints(this.p1, p)).leq(bigRat(0))
	}
	
	/**
	 * Computes the intersection of the segments
	 *
	 * WARNING: Incomplete !!!
	 */
	intersection(s: Q2Segment) : NoIntersection | Q2Segment | Q2Point {
		let tpl = PQ2Line.fromQ2Segment(this);
		let spl = PQ2Line.fromQ2Segment(s);
		
		let inter = tpl.intersection(spl);
		if (inter instanceof PQ2Line) {	// We know that all points are on the same line
			return new NoIntersection();	// Todo finish !
		} else if (inter instanceof PQ2Point) {
			if (inter.isAtInfinity()) {
				return new NoIntersection();
			} else {
				return new Q2Point(inter.x.divide(inter.w), inter.y.divide(inter.w));
			}
		} else {
			throw "Internal fatal error: Type match impossible"
		}
	}
	
}


/*********************************
 ****** Projective geometry ******
 *********************************/

/**
 * This class is used for projective calculus
 */
class Q3Support {
	
	x: BigRational;
	y: BigRational;
	z: BigRational;
	
	constructor(x: BigRational, y: BigRational, z:BigRational) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
	
	/**
	 * Create a support from a projective point
	 *
	 * Warning: Coordinates are shifted and Q3Support.fromPQ2Point(pp).x =/= pp.x
	 */
	static fromPQ2Point(pp: PQ2Point) {
		return new Q3Support(pp.w, pp.x, pp.y);
	}
	
	/**
	 * Computes the cross product of two supports
	 */
	cross(s: Q3Support) : Q3Support {
		return new Q3Support( (new Q2Vector(this.y, this.z)).det(new Q2Vector(s.y, s.z))
		                    , (new Q2Vector(this.z, this.x)).det(new Q2Vector(s.z, s.x))
		                    , (new Q2Vector(this.x, this.y)).det(new Q2Vector(s.x, s.y))
		);
	}
	
	/**
	 * Checks if all the composant are null. In this case, it is not suited to be used to
	 * construct projective elements
	 */
	isZero(): boolean {
		return this.x.isZero() && this.y.isZero() && this.z.isZero();
	}
	
}


/**
 * Represents a point in PQ^2 in homogeneous coordinates
 */
class PQ2Point {
	
	x: BigRational;
	y: BigRational;
	w: BigRational;
	
	constructor(x: BigRational, y: BigRational, w: BigRational) {
		this.x = x;
		this.y = y;
		this.w = w;
		if (this.x.isZero() && this.y.isZero(), this.w.isZero()) {
			throw "Trying to create projective point from three null coordinates";
		}
	}
	
	static fromQ2Point(p: Q2Point): PQ2Point {
		return new PQ2Point(p.x, p.y, bigRat.one);
	}
	
	static fromSupport(s: Q3Support): PQ2Point {
		return new PQ2Point(s.x, s.y, s.z);
	}
	
	/**
	 * Checks if the point is at infinity
	 */
	isAtInfinity(): boolean {
		return this.w.isZero();
	}
	
}

/**
 * Represent a line equation in PQ2 in homogeneous coordinates
 *
 * The line equation is C0 + C1.x + C2.y = 0
 *
 */
class PQ2Line {
	
	C0: BigRational
	C1: BigRational
	C2: BigRational
	
	constructor(C0: BigRational, C1: BigRational, C2: BigRational) {
		this.C0 = C0;
		this.C1 = C1;
		this.C2 = C2;
		if (this.C0.isZero() && this.C1.isZero(), this.C2.isZero()) {
			throw "Trying to create projective line from three null coordinates";
		}
	}
	
	static fromSupport(s: Q3Support): PQ2Line {
		return new PQ2Line(s.x, s.y, s.z);
	}
	
	static fromPQ2Points(pp0: PQ2Point, pp1: PQ2Point): PQ2Line {
		let s0 = Q3Support.fromPQ2Point(pp0);
		let s1 = Q3Support.fromPQ2Point(pp1);
		
		return PQ2Line.fromSupport(s0.cross(s1));
	}
	
	static fromQ2Segment(s: Q2Segment): PQ2Line {
		return PQ2Line.fromPQ2Points(PQ2Point.fromQ2Point(s.p0), PQ2Point.fromQ2Point(s.p1));
	}
	
	/**
	 * Returns the underlying support in Q^3 of the line
	 */
	support(): Q3Support {
		return new Q3Support(this.C0, this.C1, this.C2);
	}
	
	/**
	 * Returns the intersection of two projective lines
	 */
	intersection(l: PQ2Line): PQ2Line | PQ2Point {
		let ts = this.support();
		let ls = l.support();
		
		let inter = ts.cross(ls);
		if (inter.isZero()) {	// Both lines are the same
			return this;
		} else {
			return PQ2Point.fromSupport(inter);
		}
	}
	
}



