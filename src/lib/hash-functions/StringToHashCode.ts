/**
 * A hashing function for a string.
 *
 * source: https://stackoverflow.com/a/8076436
 * @param input
 */
const stringToHashCode = (input: string) => {
	let hash = 0;
	for (let i = 0; i < input.length; i++) {
		const character = input.charCodeAt(i);
		hash = (hash << 5) - hash + character;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
};

export default stringToHashCode;
