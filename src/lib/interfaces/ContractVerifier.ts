import { Hashable } from './Hashable';
import VerificationError from '../errors/VerificationError';
import NotExtensiveExampleError from '../errors/NotExtensiveExampleError';

class ContractVerifier {
	testObjects: Hashable[] = [];

	warningWriter = (warning: string) => {
		throw new NotExtensiveExampleError(warning);
	};

	constructor(testObjects: Hashable[] = []) {
		this.testObjects = testObjects;
	}

	/**
	 * Throws an error if any contract is broken with details of the broken contract.
	 */
	verifyContract(): void {
		this.verifyEqualsContract();
		this.verifyHashCodeContract();
	}

	verifyEqualsContract(): void {
		this.verifyEqualsReflexive();
		this.verifyEqualsSymmetric();
		this.verifyEqualsTransitive();
		this.verifyEqualsConsistent();
	}

	verifyEqualsReflexive(): void {
		if (this.testObjects.length === 0)
			this.warningWriter('At least one objects should be given. Equals reflexivity could not be tested.');

		for (const singleObject of this.testObjects) {
			if (!singleObject.equals(singleObject)) {
				throw new VerificationError('equals', 'reflexivity', [singleObject]);
			}
		}
	}

	verifyEqualsSymmetric(): void {
		if (this.testObjects.length < 2)
			this.warningWriter('At least two objects should be given. Equals symmetry could not be tested.');

		for (const x of this.testObjects) {
			for (const y of this.testObjects) {
				if (x.equals(y))
					if (x.equals(y) !== y.equals(x)) {
						throw new VerificationError('equals', 'symmetric', [x, y]);
					}
			}
		}
	}

	verifyEqualsTransitive(): void {
		if (this.testObjects.length < 3)
			this.warningWriter('At least three objects should be given. Equals transitivity could not be tested.');

		for (const x of this.testObjects) {
			for (const y of this.testObjects) {
				if (!x.equals(y)) continue;

				for (const z of this.testObjects) {
					if (!y.equals(z)) continue;

					if (!x.equals(z)) {
						throw new VerificationError('equals', 'transitivity', [x, y, z]);
					}
				}
			}
		}
	}

	// Can only approach this probabilistically, but this should be good enough
	verifyEqualsConsistent(): void {
		if (this.testObjects.length === 0)
			this.warningWriter('No object was given to the Verifier. Equals consistency could not be tested.');

		for (const x of this.testObjects) {
			for (const y of this.testObjects) {
				const firstObtainedValue = x.equals(y);
				for (let i = 0; i < 100; i++) {
					if (x.equals(y) !== firstObtainedValue) {
						throw new VerificationError('equals', 'consistency', [x, y]);
					}
				}
			}
		}
	}

	verifyHashCodeContract(): void {
		this.verifyHashCodeGeneralConsistency();
		this.verifyHashCodeEqualsConsistency();
	}

	verifyHashCodeGeneralConsistency(): void {
		if (this.testObjects.length === 0)
			this.warningWriter('No object was given to the Verifier. HashCode consistency could not be tested.');

		for (const x of this.testObjects) {
			const firstObtainedValue = x.hashCode();
			for (let i = 0; i < 100; i++) {
				if (x.hashCode() !== firstObtainedValue) {
					throw new VerificationError('hashCode', 'general consistency', [x]);
				}
			}
		}
	}

	verifyHashCodeEqualsConsistency(): void {
		if (this.testObjects.length === 0)
			this.warningWriter(
				'No object was given to the Verifier. HashCode consistency with equals could not be tested.',
			);

		let atLeastOneEquals = false;
		for (const x of this.testObjects) {
			for (const y of this.testObjects) {
				if (x.equals(y)) {
					atLeastOneEquals = true;
					if (x.hashCode() !== y.hashCode())
						throw new VerificationError('hashCode', 'equals consistency', [x, y]);
				}
			}
		}

		if (!atLeastOneEquals)
			this.warningWriter(
				'Among the objects no equality was found, thus the HashCode consistency with equals could not be tested.',
			);
	}
}

export default ContractVerifier;
