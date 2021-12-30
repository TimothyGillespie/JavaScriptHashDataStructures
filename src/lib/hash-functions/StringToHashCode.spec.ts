import stringToHashCode from './StringToHashCode';

describe('stringToHashCode', () => {
	const someStrings = [
		'nutiae',
		'ogugl',
		'A',
		'a',
		'b',
		'c',
		'enfulge',
		'vlfgnu',
		'fgvxlc',
		'mäuprtd' + 'auritdn/{}',
		'{',
		'}' + '{})(-::',
	];

	it.each(someStrings)('is generally consistent for input %s', (input) => {
		const expectation = stringToHashCode(input);
		for (let i = 0; i < 100; i++) {
			expect(stringToHashCode(input)).toBe(expectation);
		}
	});

	it('is collision free in the sample set', () => {
		const hashCodes = someStrings.map((x) => stringToHashCode(x));
		for (const singleHashCode of hashCodes) {
			expect(hashCodes.filter((x) => x === singleHashCode).length).toBe(1);
		}
	});

	it('works with empty string', () => {
		expect(() => stringToHashCode('')).not.toThrow();
		expect(stringToHashCode('')).not.toBeUndefined();
		expect(stringToHashCode('')).not.toBeNull();
		expect(stringToHashCode('')).not.toBeNaN();
	});

	it('is case sensitive', () => {
		expect(stringToHashCode('a')).not.toEqual(stringToHashCode('A'));
	});

	it('is left pad space sensitive', () => {
		expect(stringToHashCode('a')).not.toEqual(stringToHashCode('a '));
	});

	it('is right pad space sensitive', () => {
		expect(stringToHashCode('a')).not.toEqual(stringToHashCode('a '));
	});

	it('is inner space sensitive', () => {
		expect(stringToHashCode('a a')).not.toEqual(stringToHashCode('aa'));
	});
});
