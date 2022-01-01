import {Hashable} from "../interfaces";

export class MutableHashSet<E extends Hashable> {
	private _values = new Map<number, E[]>();
	private _size = 0;

	get size(): number {
		return this._size;
	}

	add(element: E): MutableHashSet<E> {
		const hashCodeCategory = this._values.get(element.hashCode());
		if(hashCodeCategory === undefined) {
			this._values.set(element.hashCode(), [element]);
			this._size++
		} else {
			const filteredCategory = hashCodeCategory.filter(x => !x.equals(element));
			if(filteredCategory.length === hashCodeCategory.length) {
				this._values.set(element.hashCode(), [...filteredCategory, element])
				this._size++;
			}
		}

		return this;
	}

	delete(element: E): boolean {
		const hashCodeCategory = this._values.get(element.hashCode());
		if(hashCodeCategory === undefined) return false;

		const filteredCategory = hashCodeCategory.filter(x => !x.equals(element));
		this._values.set(element.hashCode(), [...filteredCategory])

		if(hashCodeCategory.length !== filteredCategory.length) {
			this._size--;
			return true;
		}

		return false;
	}

	has(element: E): boolean {
		const hashCodeCategory = this._values.get(element.hashCode());
		if(hashCodeCategory === undefined) return false;

		const filteredCategory = hashCodeCategory.filter(x => !x.equals(element));
		return hashCodeCategory.length !== filteredCategory.length;
	}

	*elements(): Generator<E> {
		const iterator = this._values.values();
		let hashCodeCategory = iterator.next();
		while (!hashCodeCategory.done) {
			for (const singleValue of hashCodeCategory.value) {
				yield singleValue;
			}
			hashCodeCategory = iterator.next();
		}
	}

	union(otherMutableHashSet: MutableHashSet<E>): MutableHashSet<E> {
		const resultSet = this.clone();

		for(const singleElement of otherMutableHashSet.elements()) {
			resultSet.add(singleElement);
		}

		return resultSet;
	}

	intersection(otherMutableHashSet: MutableHashSet<E>): MutableHashSet<E> {
		const resultSet = new MutableHashSet<E>();
		for(const singleElement of this.elements()) {
			if(otherMutableHashSet.has(singleElement)) resultSet.add(singleElement);
		}

		return resultSet;
	}

	difference(otherMutableHashSet: MutableHashSet<E>): MutableHashSet<E> {
		const resultSet = this.clone();

		for(const singleElement of otherMutableHashSet.elements()) {
			resultSet.delete(singleElement);
		}

		return resultSet;
	}

	symmetricDifference(otherMutableSet: MutableHashSet<E>): MutableHashSet<E> {
		const union = this.union(otherMutableSet);
		const intersection = this.intersection(otherMutableSet);

		return union.difference(intersection);
	}

	clone(): MutableHashSet<E> {
		const resultSet = new MutableHashSet<E>();

		for(const singleElement of this.elements()) {
			resultSet.add(singleElement);
		}

		return resultSet;
	}

	toArray(): E[] {
		return [...this.elements()];
	}
}
