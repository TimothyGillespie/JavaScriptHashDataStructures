import { Hashable } from '../interfaces';
import { ImmutableHashMap } from './immutable-hash-map';

export class HashObject implements Hashable {
	constructor(public value: number) {}

	equals(other: Hashable): boolean {
		if (!(other instanceof HashObject)) return false;
		return this.value === other.value;
	}

	hashCode(): number {
		return this.value % 13;
	}
}

// tslint:disable-next-line:max-classes-per-file
class ValueObject {
	constructor(public a: number, public b: string) {}
}

let map: ImmutableHashMap<HashObject, any>;

describe('ImmutableHashMap', () => {
	beforeEach(() => {
		map = new ImmutableHashMap();
	});

	describe('default values', () => {
		it('size is initially 0', () => {
			expect(map.size).toBe(0);
		});
	});

	describe('set()', () => {
		it('increases size by 1', () => {
			expect(map.size).toBe(0);
			map = map.set(new HashObject(1), new ValueObject(1, 'a'));
			expect(map.size).toBe(1);
		});

		it('behaves immutably', () => {
			expect(map.size).toBe(0);
			const newMap = map.set(new HashObject(1), new ValueObject(1, 'a'));
			expect(map.size).toBe(0);
			expect(newMap.size).toBe(1);
		});

		it('increases size by 1 on collision with not equal keys', () => {
			expect(map.size).toBe(0);
			map = map.set(new HashObject(1), new ValueObject(1, 'a'));
			expect(map.size).toBe(1);
			map = map.set(new HashObject(14), new ValueObject(1, 'a'));
			expect(map.size).toBe(2);
		});

		it('does not increase the size with equal keys', () => {
			expect(map.size).toBe(0);
			map = map.set(new HashObject(1), new ValueObject(1, 'a'));
			expect(map.size).toBe(1);
			map = map.set(new HashObject(1), new ValueObject(1, 'a'));
			expect(map.size).toBe(1);
		});
	});

	describe('get()', () => {
		it('obtains an inserted value', () => {
			map = map.set(new HashObject(1), new ValueObject(1, 'a'));
			expect(map.get(new HashObject(1))).toEqual(new ValueObject(1, 'a'));
		});

		it('returns undefined when no value with that key exists', () => {
			expect(map.get(new HashObject(1))).toBe(undefined);
		});

		it('is not tricked by colliding hash code and returns undefined correctly', () => {
			map = map.set(new HashObject(1), new ValueObject(1, 'a'));
			expect(map.get(new HashObject(14))).toBe(undefined);
		});

		it('is not tricked by colliding hash code and selects the correct value 1', () => {
			map = map.set(new HashObject(1), new ValueObject(1, 'a'));
			map = map.set(new HashObject(14), new ValueObject(2, 'b'));
			expect(map.get(new HashObject(1))).toEqual(new ValueObject(1, 'a'));
		});

		it('is not tricked by colliding hash code and selects the correct value 2', () => {
			map = map.set(new HashObject(1), new ValueObject(1, 'a'));
			map = map.set(new HashObject(14), new ValueObject(2, 'b'));
			expect(map.get(new HashObject(14))).toEqual(new ValueObject(2, 'b'));
		});
	});

	describe('has()', () => {
		it('returns false when no object with this key does not exist', () => {
			expect(map.has(new HashObject(1))).toBe(false);
		});

		it('returns true when an object with this key does exist', () => {
			map = map.set(new HashObject(1), new ValueObject(1, 'a'));
			expect(map.has(new HashObject(1))).toBe(true);
		});

		it('is no tricked by hashCode collision', () => {
			map = map.set(new HashObject(1), new ValueObject(1, 'a'));
			expect(map.has(new HashObject(14))).toBe(false);
		});
	});

	describe('delete()', () => {
		it('decreases size by 1 when deleting existing object', () => {
			expect(map.size).toBe(0);
			map = map.set(new HashObject(1), new ValueObject(1, 'a'));
			expect(map.size).toBe(1);
			map = map.delete(new HashObject(1));
			expect(map.size).toBe(0);
		});

		it('does not decrease size when deleting non-existing object', () => {
			expect(map.size).toBe(0);
			map = map.set(new HashObject(1), new ValueObject(1, 'a'));
			expect(map.size).toBe(1);
			map = map.delete(new HashObject(2));
			expect(map.size).toBe(1);
		});

		it('deletes only one object when hash codes collide', () => {
			expect(map.size).toBe(0);
			map = map.set(new HashObject(1), new ValueObject(1, 'a'));
			map = map.set(new HashObject(14), new ValueObject(2, 'b'));
			expect(map.size).toBe(2);
			map = map.delete(new HashObject(1));
			expect(map.size).toBe(1);
		});

		it('deletes the correct object when hash codes collide 1', () => {
			map = map.set(new HashObject(1), new ValueObject(1, 'a'));
			map = map.set(new HashObject(14), new ValueObject(2, 'b'));
			map = map.delete(new HashObject(1));
			expect(map.get(new HashObject(1))).toBe(undefined);
			expect(map.get(new HashObject(14))).toEqual(new ValueObject(2, 'b'));
		});

		it('deletes the correct object when hash codes collide 2', () => {
			map = map.set(new HashObject(1), new ValueObject(1, 'a'));
			map = map.set(new HashObject(14), new ValueObject(2, 'b'));
			map = map.delete(new HashObject(14));
			expect(map.get(new HashObject(1))).toEqual(new ValueObject(1, 'a'));
			expect(map.get(new HashObject(14))).toBe(undefined);
		});

		it('behaves immutably', () => {
			map = map.set(new HashObject(1), new ValueObject(1, 'a'));
			map = map.set(new HashObject(14), new ValueObject(2, 'b'));
			const newMap = map.delete(new HashObject(14));

			expect(newMap.get(new HashObject(1))).toEqual(new ValueObject(1, 'a'));
			expect(newMap.get(new HashObject(14))).toBe(undefined);

			expect(map.get(new HashObject(1))).toEqual(new ValueObject(1, 'a'));
			expect(map.get(new HashObject(14))).toEqual(new ValueObject(2, 'b'));
		});
	});

	describe('entries()', () => {
		it('terminates right away when there are no entries', () => {
			for (const _ of map.entries()) {
				throw new Error('Should not reach this!');
			}
		});

		it('iterates over a singular value', () => {
			map = map.set(new HashObject(3), new ValueObject(3, 'c'));
			let i = 0;
			for (const [key, value] of map.entries()) {
				expect(key).toEqual(new HashObject(3));
				expect(value).toEqual(new ValueObject(3, 'c'));
				i++;
			}

			expect(i).toBe(1);
		});

		it('iterates over two values', () => {
			map = map.set(new HashObject(3), new ValueObject(3, 'c'));
			map = map.set(new HashObject(4), new ValueObject(4, 'd'));
			let i = 0;
			for (const [key, value] of map.entries()) {
				if (key.value === 3) {
					expect(value).toEqual(new ValueObject(3, 'c'));
				} else if (key.value === 4) {
					expect(value).toEqual(new ValueObject(4, 'd'));
				} else {
					throw new Error('Unexpected value found.');
				}

				i++;
			}

			expect(i).toBe(2);
		});
	});

	describe('values()', () => {
		it('terminates right away when there are no entries', () => {
			for (const _ of map.values()) {
				throw new Error('Should not reach this!');
			}
		});

		it('iterates over a singular value', () => {
			map = map.set(new HashObject(3), new ValueObject(3, 'c'));
			let i = 0;
			for (const singleValue of map.values()) {
				expect(singleValue).toEqual(new ValueObject(3, 'c'));
				i++;
			}

			expect(i).toBe(1);
		});

		it('iterates over two values', () => {
			map = map.set(new HashObject(3), new ValueObject(3, 'c'));
			map = map.set(new HashObject(4), new ValueObject(4, 'd'));
			let i = 0;
			for (const singleValue of map.values()) {
				if (singleValue.a === 3) {
					expect(singleValue).toEqual(new ValueObject(3, 'c'));
				} else if (singleValue.a === 4) {
					expect(singleValue).toEqual(new ValueObject(4, 'd'));
				} else {
					throw new Error('Unexpected value found.');
				}

				i++;
			}

			expect(i).toBe(2);
		});
	});

	describe('keys()', () => {
		it('terminates right away when there are no entries', () => {
			for (const _ of map.keys()) {
				throw new Error('Should not reach this!');
			}
		});

		it('iterates over a singular key', () => {
			map = map.set(new HashObject(3), new ValueObject(3, 'c'));
			let i = 0;
			for (const key of map.keys()) {
				expect(key).toEqual(new HashObject(3));
				i++;
			}

			expect(i).toBe(1);
		});

		it('iterates over two keys', () => {
			map = map.set(new HashObject(3), new ValueObject(3, 'c'));
			map = map.set(new HashObject(4), new ValueObject(4, 'd'));
			let i = 0;
			for (const key of map.keys()) {
				expect(key.value === 3 || key.value === 4).toBe(true);
				i++;
			}

			expect(i).toBe(2);
		});
	});

	it('works with objects fulfilling the interface as well', () => {
		let objectMap = new ImmutableHashMap();
		objectMap = objectMap.set({ equals: (_) => true, hashCode: () => 3 }, 'some value');
		expect(objectMap.get({ equals: (_) => true, hashCode: () => 3 })).toBe('some value');
	});
});
