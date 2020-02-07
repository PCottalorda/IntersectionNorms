
class Q2Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	

	function dot(p) {
		return (this.x.multiply(p.x)).add(this.y.multiply(p.y));
	}
		
};

class Q2Vector {
	constructor(p0, p1) {
		this.x = p1.x.minus(p0.x);
		this.y = p1.y.minus(p0.y);
	}
	
	function plus(p) {
		return Q2Vector(this.x.plus(p.x), this.y.plus(p.y));
	}
	
	function minus(p) {
		return Q2Vector(this.x.minus(p.x), this.y.minus(p.y));
	}
	
	
	
}