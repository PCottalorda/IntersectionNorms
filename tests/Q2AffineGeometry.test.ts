import { Q2Vector } from '../src/Q2AffineGeometry'
const bigRat = require('big-rational')

test('Q2Vector self equality test', () => {
	let v = new Q2Vector(bigRat(1), bigRat(0));
	expect(v.equals(v)).toBeTruthy();
});