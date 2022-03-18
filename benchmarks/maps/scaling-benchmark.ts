import { ImmutableHashMap, MutableHashMap } from '../../src';
import * as Benchmark from 'benchmark';
import { LargeObject } from './models';
import faker from '@faker-js/faker';
import * as clonedeep from 'lodash.clonedeep';

faker.seed(new Date(2022, 1, 1).valueOf());

const createRandomLargeObject = () => {
    return new LargeObject(
        faker.name.firstName(),
        faker.name.lastName(),
        faker.name.middleName(),
        faker.date.past(90),
        faker.fake('{{address.streetAddress}} {{address.zipCode}} {{address.cityName}} {{address.state}}')
    );
};

const existingKey = createRandomLargeObject();
const existingValue = createRandomLargeObject();
const nonExistingKey = createRandomLargeObject();
const someValue = createRandomLargeObject();

const nonExistingKeyBuiltIn = Math.random();
const nonExistingValueBuiltIn = Math.random();

const values = [];
const builtInValues = [];
for (let i = 0; i < 10_000 - 1; i++) {
    values.push([createRandomLargeObject(), createRandomLargeObject()]);
}

for (let i = 0; i < 10_000 - 1; i++) {
    builtInValues.push([Math.random(), Math.random()]);
}

values.push([existingKey, existingValue]);

const originalBuiltIn = new Map(builtInValues);
const originalImmutable = new ImmutableHashMap(values);
const originalMutable = new MutableHashMap(values);

let usedBuiltIn = clonedeep(originalBuiltIn);
let usedImmutable = clonedeep(originalImmutable);
let usedMutable = clonedeep(originalMutable);

const suite = new Benchmark.Suite();
let counter = 0;

suite.on('cycle', () => {
    usedBuiltIn = clonedeep(originalBuiltIn);
    usedImmutable = clonedeep(originalImmutable);
    usedMutable = clonedeep(originalMutable);
    counter++;
});

suite
    .add('[set new][built-in][small object]', () => {
        usedBuiltIn.set(nonExistingKeyBuiltIn, nonExistingValueBuiltIn);
    })
    .add('[set new][mutable-hash-map][small object]', () => {
        usedMutable.set(nonExistingKey, someValue);
    })
    .add('[set new][immutable-hash-map][small object]', () => {
        usedImmutable.set(nonExistingKey, someValue);
    });
//
// suite
//     .add('[set existing][built-in][small object]', () => {
//         prepopulatedBuiltIn1.set(existingKey, 5);
//     })
//     .add('[set existing][mutable-hash-map][small object]', () => {
//         prepopulatedMutableHashmap1.set(existingKey, 5);
//     })
//     .add('[set existing][immutable-hash-map][small object]', () => {
//         prepopulatedImmutableHashmap1.set(existingKey, 5);
//     });
//
// suite
//     .add('[get existing][built-in][small object]', () => {
//         prepopulatedBuiltIn1.get(existingKey);
//     })
//     .add('[get existing][mutable-hash-map][small object]', () => {
//         prepopulatedMutableHashmap1.get(existingKey);
//     })
//     .add('[get existing][immutable-hash-map][small object]', () => {
//         prepopulatedImmutableHashmap1.get(existingKey);
//     });
//
// suite
//     .add('[get not existing][built-in][small object]', () => {
//         prepopulatedBuiltIn1.get(notExistingKey);
//     })
//     .add('[get not existing][mutable-hash-map][small object]', () => {
//         prepopulatedMutableHashmap1.get(notExistingKey);
//     })
//     .add('[get not existing][immutable-hash-map][small object]', () => {
//         prepopulatedImmutableHashmap1.get(notExistingKey);
//     });
//
// suite
//     .add('[has existing][built-in][small object]', () => {
//         prepopulatedBuiltIn1.has(existingKey);
//     })
//     .add('[has existing][mutable-hash-map][small object]', () => {
//         prepopulatedMutableHashmap1.has(existingKey);
//     })
//     .add('[has existing][immutable-hash-map][small object]', () => {
//         prepopulatedImmutableHashmap1.has(existingKey);
//     });
//
// suite
//     .add('[has not existing][built-in][small object]', () => {
//         prepopulatedBuiltIn1.has(notExistingKey);
//     })
//     .add('[has not existing][mutable-hash-map][small object]', () => {
//         prepopulatedMutableHashmap1.has(notExistingKey);
//     })
//     .add('[has not existing][immutable-hash-map][small object]', () => {
//         prepopulatedImmutableHashmap1.has(notExistingKey);
//     });
//
// suite
//     .add('[delete existing][built-in][small object]', () => {
//         prepopulatedBuiltIn2.delete(existingKey);
//     })
//     .add('[delete existing][mutable-hash-map][small object]', () => {
//         prepopulatedMutableHashmap2.delete(existingKey);
//     })
//     .add('[delete existing][immutable-hash-map][small object]', () => {
//         prepopulatedImmutableHashmap2.delete(existingKey);
//     });
//
// suite
//     .add('[delete not existing][built-in][small object]', () => {
//         prepopulatedBuiltIn3.delete(existingKey);
//     })
//     .add('[delete not existing][mutable-hash-map][small object]', () => {
//         prepopulatedMutableHashmap3.delete(existingKey);
//     })
//     .add('[delete not existing][immutable-hash-map][small object]', () => {
//         prepopulatedImmutableHashmap3.delete(existingKey);
//     });

suite
    .on('cycle', (event) => {
        // tslint:disable-next-line:no-console
        console.log(String(event.target));
        console.log(counter);
    })
    .run();
