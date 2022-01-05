import {Hashable} from "../../src";

export class SmallObject implements Hashable {

	constructor(public value: number) {}

	equals(other: Hashable): boolean {
		if(!(other instanceof SmallObject)) return false;
		return this.value === other.value;
	}

	hashCode(): number {
		return this.value;
	}
}
