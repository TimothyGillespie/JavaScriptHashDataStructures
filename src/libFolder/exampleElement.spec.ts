import { sayHello } from './exampleElement';

describe('sayHello()', () => {
	it('Program is too shy to say hello', () => {
		expect(() => sayHello()).toThrowError();
	});
});
