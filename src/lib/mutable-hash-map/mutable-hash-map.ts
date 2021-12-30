import { Hashable } from '../interfaces';

export class MutableHashMap<K extends Hashable, V> {
	private _values: Map<number, { key: K; value: V }[]>;
	size: number;

	constructor() {
		this._values = new Map();
		this.size = 0;
	}

	set(key: K, value: V): void {
		const initialValue = this._values.get(key.hashCode());
		if (initialValue === undefined) {
			this._values.set(key.hashCode(), [
				{
					key,
					value,
				},
			]);
			this.size++;
		} else {
			if (initialValue.find((x) => x.key.equals(key)) === undefined) {
				this._values.set(key.hashCode(), [...initialValue, { key, value }]);
				this.size++;
			} else {
				this._values.set(key.hashCode(), [...initialValue.filter((x) => !x.key.equals(key)), { key, value }]);
			}
		}
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

		this.size--;
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
}
