import { Hashable } from '../interfaces';

export class MutableHashMap<K extends Hashable, V> {
	private _values: Map<number, { key: K; value: V }[]>;
	private _size: number;

	get size(): number {
		return this._size;
	}

	constructor() {
		this._values = new Map();
		this._size = 0;
	}

	set(key: K, value: V): MutableHashMap<K, V> {
		const initialValue = this._values.get(key.hashCode());
		if (initialValue === undefined) {
			this._values.set(key.hashCode(), [
				{
					key,
					value,
				},
			]);
			this._size++;
		} else {
			if (initialValue.find((x) => x.key.equals(key)) === undefined) {
				this._values.set(key.hashCode(), [...initialValue, { key, value }]);
				this._size++;
			} else {
				this._values.set(key.hashCode(), [...initialValue.filter((x) => !x.key.equals(key)), { key, value }]);
			}
		}

		return this;
	}

	get(key: K): V | undefined {
		const entryByHashCode = this._values.get(key.hashCode());
		if (entryByHashCode === undefined) {
			return undefined;
		}

		const found = entryByHashCode.find((x) => x.key.equals(key));
		if (found === undefined) {
			return undefined;
		}

		return found.value;
	}

	has(key: K): boolean {
		return this.get(key) !== undefined;
	}

	delete(key: K): boolean {
		const entryByHashCode = this._values.get(key.hashCode());
		if (entryByHashCode === undefined) {
			return false;
		}

		const newList = entryByHashCode.filter((x) => !x.key.equals(key));
		if (newList.length === entryByHashCode.length) {
			return false;
		}

		if (newList.length === 0) {
			this._values.delete(key.hashCode());
		} else {
			this._values.set(key.hashCode(), newList);
		}

		this._size--;
		return true;
	}

	*entries(): Generator<[K, V]> {
		const iterator = this._values.values();
		let nextIntermediaryValue = iterator.next();
		while (!nextIntermediaryValue.done) {
			for (const actualPair of nextIntermediaryValue.value) {
				const { key: nextKey, value: nextValue } = actualPair;
				yield [nextKey, nextValue];
			}
			nextIntermediaryValue = iterator.next();
		}
	}

	*values(): Generator<V> {
		for (const [_, value] of this.entries()) {
			yield value;
		}
	}

	*keys(): Generator<K> {
		for (const [key, _] of this.entries()) {
			yield key;
		}
	}
}
