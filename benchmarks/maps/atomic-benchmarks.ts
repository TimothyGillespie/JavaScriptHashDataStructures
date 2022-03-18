import * as Benchmark from 'benchmark';
import {SmallObject} from "./models";
import {ImmutableHashMap, MutableHashMap} from "../../src";
const suite = new Benchmark.Suite();

const existingKey = new SmallObject(3);
const notExistingKey = new SmallObject(1);

const prepopulatedBuiltIn1 = new Map();
prepopulatedBuiltIn1.set(existingKey, 5);
const prepopulatedMutableHashmap1 = new MutableHashMap();
prepopulatedMutableHashmap1.set(existingKey, 5);
const prepopulatedImmutableHashmap1 = new ImmutableHashMap()
	.set(existingKey, 5);


const prepopulatedBuiltIn2 = new Map();
prepopulatedBuiltIn1.set(existingKey, 5);
const prepopulatedMutableHashmap2 = new MutableHashMap();
prepopulatedMutableHashmap1.set(existingKey, 5);
const prepopulatedImmutableHashmap2 = new ImmutableHashMap()
	.set(existingKey, 5);

const prepopulatedBuiltIn3 = new Map();
prepopulatedBuiltIn1.set(existingKey, 5);

const prepopulatedMutableHashmap3 = new MutableHashMap();
prepopulatedMutableHashmap1.set(existingKey, 5);

const prepopulatedImmutableHashmap3 = new ImmutableHashMap()
	.set(existingKey, 5);

suite.add('[set new][built-in][small object]', () => {
	const map = new Map();
	map.set(existingKey, 5);
}).add('[set new][mutable-hash-map][small object]', () => {
	const map = new MutableHashMap();
	map.set(existingKey, 5);
}).add('[set new][immutable-hash-map][small object]', () => {
	let map = new Map();
	map = map.set(existingKey, 5);
});

suite.add('[set existing][built-in][small object]', () => {
	prepopulatedBuiltIn1.set(existingKey, 5);
}).add('[set existing][mutable-hash-map][small object]', () => {
	prepopulatedMutableHashmap1.set(existingKey, 5);
}).add('[set existing][immutable-hash-map][small object]', () => {
	prepopulatedImmutableHashmap1.set(existingKey, 5);
});

suite.add('[get existing][built-in][small object]', () => {
	prepopulatedBuiltIn1.get(existingKey);
}).add('[get existing][mutable-hash-map][small object]', () => {
	prepopulatedMutableHashmap1.get(existingKey);
}).add('[get existing][immutable-hash-map][small object]', () => {
	prepopulatedImmutableHashmap1.get(existingKey);
});

suite.add('[get not existing][built-in][small object]', () => {
	prepopulatedBuiltIn1.get(notExistingKey);
}).add('[get not existing][mutable-hash-map][small object]', () => {
	prepopulatedMutableHashmap1.get(notExistingKey);
}).add('[get not existing][immutable-hash-map][small object]', () => {
	prepopulatedImmutableHashmap1.get(notExistingKey);
});


suite.add('[has existing][built-in][small object]', () => {
	prepopulatedBuiltIn1.has(existingKey);
}).add('[has existing][mutable-hash-map][small object]', () => {
	prepopulatedMutableHashmap1.has(existingKey);
}).add('[has existing][immutable-hash-map][small object]', () => {
	prepopulatedImmutableHashmap1.has(existingKey);
});

suite.add('[has not existing][built-in][small object]', () => {
	prepopulatedBuiltIn1.has(notExistingKey);
}).add('[has not existing][mutable-hash-map][small object]', () => {
	prepopulatedMutableHashmap1.has(notExistingKey);
}).add('[has not existing][immutable-hash-map][small object]', () => {
	prepopulatedImmutableHashmap1.has(notExistingKey);
});

suite.add('[delete existing][built-in][small object]', () => {
	prepopulatedBuiltIn2.delete(existingKey);
}).add('[delete existing][mutable-hash-map][small object]', () => {
	prepopulatedMutableHashmap2.delete(existingKey);
}).add('[delete existing][immutable-hash-map][small object]', () => {
	prepopulatedImmutableHashmap2.delete(existingKey);
});

suite.add('[delete not existing][built-in][small object]', () => {
	prepopulatedBuiltIn3.delete(existingKey);
}).add('[delete not existing][mutable-hash-map][small object]', () => {
	prepopulatedMutableHashmap3.delete(existingKey);
}).add('[delete not existing][immutable-hash-map][small object]', () => {
	prepopulatedImmutableHashmap3.delete(existingKey);
});



suite.on('cycle', (event) =>  {
	// tslint:disable-next-line:no-console
	console.log(String(event.target));
}).run();
