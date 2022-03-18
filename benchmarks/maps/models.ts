import { Hashable, stringToHashCode } from '../../src';

export class SmallObject implements Hashable {
    constructor(public value: number) {}

    equals(other: Hashable): boolean {
        if (!(other instanceof SmallObject)) return false;
        return this.value === other.value;
    }

    hashCode(): number {
        return this.value;
    }
}

// tslint:disable-next-line:max-classes-per-file
export class LargeObject implements Hashable {
    constructor(
        public firstName: string,
        public lastName: string,
        public middleName: string | null,
        public birthDate: Date,
        public address: string
    ) {}

    equals(other: Hashable): boolean {
        if (!(other instanceof LargeObject)) return false;
        return (
            this.firstName === other.firstName &&
            this.lastName === other.lastName &&
            this.middleName === other.middleName &&
            this.birthDate.valueOf() - other.birthDate.valueOf() === 0 &&
            this.address === other.address
        );
    }

    hashCode(): number {
        return (
            stringToHashCode(this.firstName + this.lastName + this.middleName ?? 'null' + this.address) +
            this.birthDate.valueOf()
        );
    }
}
