import { Hashable } from '../interfaces';
import { immerable, produce, enableMapSet } from 'immer';

export class ImmutableHashMap<K extends Hashable, V> {
    private _values: Map<number, { key: K; value: V }[]>;
    private _size: number;

    [immerable] = true;

    get size(): number {
        return this._size;
    }

    constructor(initialEntries: readonly (readonly [K, V])[] = []) {
        enableMapSet();
        this._values = new Map();
        this._size = 0;

        initialEntries.forEach(([key, value]) => {
            this.set(key, value);
        });
    }

    set(key: K, value: V): ImmutableHashMap<K, V> {
        return produce(this, (draft) => {
            const initialValue = this._values.get(key.hashCode());
            if (initialValue === undefined) {
                draft['_values'].set(key.hashCode(), [
                    {
                        key,
                        value,
                    },
                ]);
                draft['_size']++;
            } else {
                if (initialValue.find((x) => x.key.equals(key)) === undefined) {
                    draft['_values'].set(key.hashCode(), [...initialValue, { key, value }]);
                    draft['_size']++;
                } else {
                    draft['_values'].set(key.hashCode(), [
                        ...initialValue.filter((x) => !x.key.equals(key)),
                        { key, value },
                    ]);
                }
            }
        });
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

    delete(key: K): ImmutableHashMap<K, V> {
        return produce(this, (draft) => {
            const entryByHashCode = this._values.get(key.hashCode());
            if (entryByHashCode === undefined) {
                return draft;
            }

            const newList = entryByHashCode.filter((x) => !x.key.equals(key));
            if (newList.length === entryByHashCode.length) {
                return draft;
            }

            if (newList.length === 0) {
                draft['_values'].delete(key.hashCode());
            } else {
                draft['_values'].set(key.hashCode(), newList);
            }

            draft['_size']--;
        });
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
