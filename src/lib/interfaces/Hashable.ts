export interface Hashable {
	/**
	 * Receives another object of any type and returns a boolean indicating the calling object and the passed object are
	 * equal.
	 *
	 * true = equal
	 * false = not equal
	 *
	 * The following contract should be held:
	 * - equals is reflexive: x.equals(x) must always be true
	 * - symmetric: x.equals(y) === y.equals(x)
	 * - transitive: x.equals(y) === y.equals(z) === x.equals(z)
	 * - consistent: The value of the same equals call may only change when relevant parameters of both object change
	 *
	 * @param other The object which should be compared against.
	 */
	equals: (other: Hashable) => boolean;

	/**
	 * Returns a number which identifies the underlying object. The hash code is unrestricted and may be an integer or
	 * decimal number.
	 *
	 * The following contract should be held:
	 * - consistent: The value of the same hashCode call may only change when relevant parameters of the object changes
	 * - consistency with equals: if x.equals(y) === true then x.hashCode() === y.hashCode()
	 */
	hashCode: () => number;
}
