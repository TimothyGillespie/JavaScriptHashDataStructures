# JavaScript Hash Data Structures

When using the built-in data types of JavaScript one will run into issues when using objects. Consider the following example:

```
const map = new Map();
const key = {a: 1};
map.set(a, 'some value');
```

We have a map with an object as key. It will now make a difference if we either use our constant `key`, or if we just put
an object with the same values as `key`:

```
// work and will return 'some value'
map.get(key);

// will not found the value and return undefined
map.get({a: 1});
```

The map will try to look up the value by reference instead of by value. 

# MutableHashMap

This library provides an alternative which provide
look-ups by value. It does this by requiring you to implement its [src/lib/interfaces/Hashable.ts](Hashable interface) and keep the contract:

You can then use your class with the MutableHashMap. A simple example may look like this:

```
import {Hashable} from '@tgillespie/hash-data-structures'
class MyClass implements Hashable {

	constructor(public value: number) {}

	equals(other: Hashable): boolean {
		if (!(other instanceof ValidHashable)) return false;
		return this.value === other.value;
	}

	hashCode(): number {
		return this.value;
	}

}

const map = new MutableHashMap();
const key = new MyClass(2);
map.set(key, 'some value')

// This will still work and return 'some value'
map.get(key);

// This will now also work and return 'some value' as well
map.get(new MyClass(2));
```

It works without a class as well. However, since we need the `equals` and `hashCode` methods it is not as intuitive. Here an impractical example:

```
const objectMap = new MutableHashMap();
objectMap.set({equals: (_) => true, hashCode: () => 3}, 'some value');
expect(objectMap.get({equals: (_) => true, hashCode: () => 3})).toBe('some value');
```

# How to Design the HashCode

The hashCode method does not need to be collision free and is even expected to have collisions. This design is heavily influenced and inspired by how 
Java solved this issue, and you can use the same methods. You can also find some ideas here: https://stackoverflow.com/questions/194846/is-there-any-kind-of-hash-code-function-in-javascript

# Contract Verifier

You can verify that you class keeps the contract half-automatically with the `ContractVerifier`. You can use it like this in a jest test case:

```
class ValidHashable implements Hashable {
	constructor(public value: number) {}

	equals(other: Hashable): boolean {
		if (!(other instanceof ValidHashable)) return false;
		return this.value === other.value;
	}

	hashCode(): number {
		return this.value;
	}
}

const example = [new ValidHashable(1), new ValidHashable(2), new ValidHashable(3)];
expect(() => new ContractVerifier(example).verifyContract()).not.toThrow();
```

It will throw an `VerificationError` if one contract property is not held. It will throw an `NotExtensiveExampleError` if it was found that your examples could
not verify a property (it is not very sophisticated with this, so you should not rely on this too much as of now).
