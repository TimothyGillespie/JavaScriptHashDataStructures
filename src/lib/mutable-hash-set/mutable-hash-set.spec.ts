import { MutableHashSet } from './mutable-hash-set';
import { HashObject } from '../mutable-hash-map/mutable-hash-map.spec';

let set: MutableHashSet<HashObject>;

const sortHashObjectArray = (array: HashObject[]) => {
	const copy = [...array];
	copy.sort((x, y) => x.value - y.value);
	return copy;
};

describe('MutableHashSet', () => {
	beforeEach(() => {
		set = new MutableHashSet();
	});

	describe('initial state', () => {
		it('initially has size 0', () => {
			expect(set.size).toBe(0);
		});

		it('is initially empty', () => {
			expect(set.toArray().length).toBe(0);
		});
	});

	describe('add()', () => {
		it('adding new element increases size by 1', () => {
			set.add(new HashObject(1));
			expect(set.size).toBe(1);
		});

		it('adding new element with hash collision increases size by 1', () => {
			set.add(new HashObject(1));
			expect(set.size).toBe(1);
			set.add(new HashObject(14));
			expect(set.size).toBe(2);
		});

		it('adding an existing element does not change the size', () => {
			set.add(new HashObject(1));
			expect(set.size).toBe(1);
			set.add(new HashObject(1));
			expect(set.size).toBe(1);
		});

		it('adding adds the element', () => {
			set.add(new HashObject(1));
			expect(set.toArray()).toEqual([new HashObject(1)]);
		});

		it('adding twice adds the element only once', () => {
			set.add(new HashObject(1));
			set.add(new HashObject(1));
			expect(set.toArray()).toEqual([new HashObject(1)]);
		});
	});

	describe('delete()', () => {
		it('deleting an existing element decreases the size by 1', () => {
			set.add(new HashObject(1));
			expect(set.size).toBe(1);

			set.delete(new HashObject(1));
			expect(set.size).toBe(0);
		});

		it('deleting a not existing element does not change the size', () => {
			set.add(new HashObject(1));
			expect(set.size).toBe(1);

			set.delete(new HashObject(2));
			expect(set.size).toBe(1);
		});

		it('deleting a not existing element with hash collision does not change the size', () => {
			set.add(new HashObject(1));
			expect(set.size).toBe(1);

			set.delete(new HashObject(14));
			expect(set.size).toBe(1);
		});

		it('deleting on of two existing element with hash collision only decreases the size by 1', () => {
			set.add(new HashObject(1));
			set.add(new HashObject(14));
			expect(set.size).toBe(2);

			set.delete(new HashObject(14));
			expect(set.size).toBe(1);
		});

		it('deleting on of two existing element with hash collision removes only the correct one', () => {
			set.add(new HashObject(1));
			set.add(new HashObject(14));
			expect(set.toArray()).toEqual([new HashObject(1), new HashObject(14)]);

			set.delete(new HashObject(14));

			expect(set.toArray()).toEqual([new HashObject(1)]);
		});

		it('is not tricked by collision', () => {
			set.add(new HashObject(1));
			expect(set.toArray()).toEqual([new HashObject(1)]);

			set.delete(new HashObject(14));

			expect(set.toArray()).toEqual([new HashObject(1)]);
		});
	});

	describe('has()', () => {
		it('returns false when the element has not been added', () => {
			expect(set.has(new HashObject(1))).toBe(false);
		});

		it('returns true when the element has been added', () => {
			set.add(new HashObject(1));
			expect(set.has(new HashObject(1))).toBe(true);
		});

		it('returns true when the element has been added twice', () => {
			set.add(new HashObject(1));
			set.add(new HashObject(1));
			expect(set.has(new HashObject(1))).toBe(true);
		});

		it('returns true when the element with collision 1', () => {
			set.add(new HashObject(1));
			set.add(new HashObject(14));
			expect(set.has(new HashObject(1))).toBe(true);
		});

		it('returns true when the element with collision 2', () => {
			set.add(new HashObject(1));
			set.add(new HashObject(14));
			expect(set.has(new HashObject(14))).toBe(true);
		});

		it('is not tricked by collision', () => {
			set.add(new HashObject(1));
			expect(set.has(new HashObject(14))).toBe(false);
		});

		it('returns false when an added element has been deleted', () => {
			set.add(new HashObject(1));
			set.delete(new HashObject(1));
			expect(set.has(new HashObject(1))).toBe(false);
		});

		it('returns false when an added element has been deleted twice', () => {
			set.add(new HashObject(1));
			set.delete(new HashObject(1));
			set.delete(new HashObject(1));
			expect(set.has(new HashObject(1))).toBe(false);
		});

		it('returns false when an twice added element has been deleted once', () => {
			set.add(new HashObject(1));
			set.add(new HashObject(1));
			set.delete(new HashObject(1));
			expect(set.has(new HashObject(1))).toBe(false);
		});
	});

	describe('set operations', () => {
		let otherSet: MutableHashSet<HashObject>;
		beforeEach(() => {
			set.add(new HashObject(1)).add(new HashObject(2)).add(new HashObject(4)).add(new HashObject(7));

			otherSet = new MutableHashSet<HashObject>()
				.add(new HashObject(1))
				.add(new HashObject(4))
				.add(new HashObject(5))
				.add(new HashObject(6));
		});

		it('union() 1', () => {
			expect(sortHashObjectArray(set.union(otherSet).toArray())).toEqual([
				new HashObject(1),
				new HashObject(2),
				new HashObject(4),
				new HashObject(5),
				new HashObject(6),
				new HashObject(7),
			]);
		});

		it('union() 2', () => {
			expect(sortHashObjectArray(otherSet.union(set).toArray())).toEqual([
				new HashObject(1),
				new HashObject(2),
				new HashObject(4),
				new HashObject(5),
				new HashObject(6),
				new HashObject(7),
			]);
		});

		it('intersection() 1', () => {
			expect(sortHashObjectArray(set.intersection(otherSet).toArray())).toEqual([
				new HashObject(1),
				new HashObject(4),
			]);
		});

		it('intersection() 2', () => {
			expect(sortHashObjectArray(otherSet.intersection(set).toArray())).toEqual([
				new HashObject(1),
				new HashObject(4),
			]);
		});

		it('difference() 1', () => {
			expect(sortHashObjectArray(set.difference(otherSet).toArray())).toEqual([
				new HashObject(2),
				new HashObject(7),
			]);
		});

		it('difference() 2', () => {
			expect(sortHashObjectArray(otherSet.difference(set).toArray())).toEqual([
				new HashObject(5),
				new HashObject(6),
			]);
		});

		it('symmetricDifference() 1', () => {
			expect(sortHashObjectArray(set.symmetricDifference(otherSet).toArray())).toEqual([
				new HashObject(2),
				new HashObject(5),
				new HashObject(6),
				new HashObject(7),
			]);
		});

		it('symmetricDifference() 2', () => {
			expect(sortHashObjectArray(otherSet.symmetricDifference(set).toArray())).toEqual([
				new HashObject(2),
				new HashObject(5),
				new HashObject(6),
				new HashObject(7),
			]);
		});
	});
});
