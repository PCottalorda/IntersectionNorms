
class Q2Point {
	
	x : bigRat;
	y : bigRat;
	
	constructor(x : bigRat, y : bigRat) {	
		this.x = x;
		this.y = y;
	}
	
	equals(p : Q2Point) : boolean {
		return this.x.equals(p.x) && this.y.equals(p.y)
	}
	
};

class Q2Vector {
	
	x : bigRat
	y : bigRat
	
	constructor(p0 : Q2Point, p1 : Q2Point) {
		this.x = p1.x.minus(p0.x);
		this.y = p1.y.minus(p0.y);
	}
	
	plus(v : Q2Vector) : Q2Vector {
		return new Q2Vector(this.x.plus(v.x), this.y.plus(v.y));
	}
	
	minus(v : Q2Vector) : Q2Vector {
		return new Q2Vector(this.x.minus(v.x), this.y.minus(v.y));
	}

	dot(v : Q2Vector) : bigRat {
		return (this.x.multiply(v.x)).add(this.y.multiply(v.y));
	}
	
	multiply(lambda : bigRat) : Q2Vector {
		return new Q2Vector(this.x.multiply(lambda), this.y.multiply(lambda));
	}
	
	equals(v : Q2Vector) : boolean {
		return this.x.equals(v.x) && this.y.equals(v.y);
	}
}

class Q2Segment {
	
	p0 : Q2Point
	p1 : Q2Point
	
	constructor(p0 : Q2Point, p1 : Q2Point) {
		if (p0.equals(p1)) {
			throw "A segment cannot be empty"
		}
		this.p0 = p0;
		this.p1 = p1;
	}
	
	vec() : Q2Vector {
		return new Q2Vector(this.p0, this.p1);
	}
	
	equals(s : Q2Segment) : boolean {
		return (this.p0.equals(s.p0) && this.p1.equals(s.p1));
	}
}

