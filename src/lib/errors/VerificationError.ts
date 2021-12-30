import Hashable from "../interfaces/Hashable";

class VerificationError extends Error {
	constructor(
		public method: 'equals' | 'hashCode',
		public property: string,
		public offendingObjects: Hashable[],
	) {
		super(`The following ${offendingObjects.length === 1 ? 'object' : 'objects'} violated the ${property} contract property of ${method}: \n`
			+ offendingObjects.map(x => JSON.stringify(x, null, '\t')).join('\n')
		);

	}
}

export default VerificationError;
