import Hashable from "./Hashable";
import ContractVerifier from "./ContractVerifier";
import VerificationError from "../errors/VerificationError";
import NotExtensiveExampleError from "../errors/NotExtensiveExampleError";

class ValidHashable implements Hashable {
  constructor(public value: number) {}

  equals(other: Hashable): boolean {
    if(!(other instanceof ValidHashable)) return false
    return this.value === other.value;
  }

  hashCode(): number {
    return this.value;
  }
}

// tslint:disable-next-line:max-classes-per-file
class NotReflexive implements Hashable {

  constructor(public value: number) {}

  equals(other: Hashable): boolean {
    if(!(other instanceof NotReflexive)) return false
    return this.value !== other.value;
  }

  hashCode(): number {
    return this.value;
  }
}

// tslint:disable-next-line:max-classes-per-file
class NotSymmetric implements Hashable {

  constructor(public value: number) {}

  equals(other: Hashable): boolean {
    if(!(other instanceof NotSymmetric)) return false
    return this.value >= other.value;
  }

  hashCode(): number {
    return this.value;
  }
}

// tslint:disable-next-line:max-classes-per-file
class NotTransitive implements Hashable {

  constructor(public value: number) {}

  equals(other: Hashable): boolean {
    if(!(other instanceof NotTransitive)) return false
    return Math.abs(this.value - other.value) <= 1;
  }

  hashCode(): number {
    return this.value;
  }
}

// tslint:disable-next-line:max-classes-per-file
class DeterministicallyInconsistentEquals implements Hashable {
  nextAnswer = true;
  constructor(public value: number) {}

  equals(_other: Hashable): boolean {
    this.nextAnswer = !this.nextAnswer;
    return this.nextAnswer;
  }

  hashCode(): number {
    return this.value;
  }
}

// tslint:disable-next-line:max-classes-per-file
class ProbabilisticallyInconsistentEquals implements Hashable {
  constructor(public value: number) {}

  equals(_other: Hashable): boolean {
    return Math.random() > 0.5;
  }

  hashCode(): number {
    return this.value;
  }
}

// tslint:disable-next-line:max-classes-per-file
class DeterministicallyInconsistentHashCode implements Hashable {
  nextAnswer = true;
  constructor(public value: number) {}

  equals(other: Hashable): boolean {
    if(!(other instanceof DeterministicallyInconsistentHashCode)) return false;
    return this.value === other.value;
  }

  hashCode(): number {
    this.nextAnswer = !this.nextAnswer;
    return this.nextAnswer ? 1 : 0;
  }
}

// tslint:disable-next-line:max-classes-per-file
class ProbabilisticallyInconsistentHashCode implements Hashable {
  constructor(public value: number) {}

  equals(other: Hashable): boolean {
    if(!(other instanceof ProbabilisticallyInconsistentHashCode)) return false;
    return this.value === other.value;
  }

  hashCode(): number {
    return Math.random();
  }
}

// tslint:disable-next-line:max-classes-per-file
class InconsistentWithEqualsHashCode implements Hashable {
  constructor(public value: number) {}

  equals(other: Hashable): boolean {
    if(!(other instanceof InconsistentWithEqualsHashCode)) return false;
    return this.value !== other.value;
  }

  hashCode(): number {
    return this.value;
  }

}

describe('ContractVerifier', () => {
  it('total method accepts the valid hashable', () => {
    const example = [new ValidHashable(1), new ValidHashable(2), new ValidHashable(3)];
    expect(() => new ContractVerifier(example).verifyContract()).not.toThrow(VerificationError);
  })

  describe('total equals verification', () => {
    it('passes', () => {
      const example = [new ValidHashable(1), new ValidHashable(2), new ValidHashable(3)];
      expect(() => new ContractVerifier(example).verifyEqualsContract()).not.toThrow(VerificationError);
    });

    it('reflexivity failing', () => {
      const example = [new NotReflexive(1), new NotReflexive(2), new NotReflexive(3)];
      try {
        new ContractVerifier(example).verifyEqualsContract();
      } catch (e) {
        expect(e instanceof VerificationError).toBe(true);
        if(e instanceof VerificationError) {
          expect(e.property).toBe('reflexivity');
        } else {
          throw Error('Did not find correct unfulfilled property.');
        }
      }
    });

    it('symmetry failing', () => {
      const example = [new NotSymmetric(1), new NotSymmetric(2), new NotSymmetric(3)];
      try {
        new ContractVerifier(example).verifyEqualsContract();
      } catch (e) {
        expect(e instanceof VerificationError).toBe(true);
        if(e instanceof VerificationError) {
          expect(e.property).toBe('symmetric');
        } else {
          throw Error('Did not find correct unfulfilled property.');
        }
      }
    });

    it('transitivity failing', () => {
      const example = [new NotTransitive(1), new NotTransitive(2), new NotTransitive(3)];
      try {
        new ContractVerifier(example).verifyEqualsContract();
      } catch (e) {
        expect(e instanceof VerificationError).toBe(true);
        if(e instanceof VerificationError) {
          expect(e.property).toBe('transitivity');
        } else {
          throw Error('Did not find correct unfulfilled property.');
        }
      }
    });

    it('consistency failing deterministically failing', () => {
      const example = [new DeterministicallyInconsistentEquals(1), new DeterministicallyInconsistentEquals(2), new DeterministicallyInconsistentEquals(3)];
      expect(() => new ContractVerifier(example).verifyEqualsContract()).toThrow(VerificationError);
    });

    it('consistency failing probabilistically failing', () => {
      const example = [new ProbabilisticallyInconsistentEquals(1), new ProbabilisticallyInconsistentEquals(2), new ProbabilisticallyInconsistentEquals(3)];
      expect(() => new ContractVerifier(example).verifyEqualsContract()).toThrow(VerificationError);
    });
  });

  describe('singular equals methods', () => {
    describe('reflexivity', () => {
      it('can determine that it is reflexive', () => {
        const example = [new ValidHashable(1)];
        expect(() => new ContractVerifier(example).verifyEqualsReflexive()).not.toThrow(VerificationError);
      });

      it('can determine that it is not reflexive', () => {
        const example = [new NotReflexive(1)];
        expect(() => new ContractVerifier(example).verifyEqualsReflexive()).toThrow(VerificationError);
      });
    });

    describe('symmetry', () => {
      it('can determine that it is symmetric', () => {
        const example = [new ValidHashable(1), new ValidHashable(2)];
        expect(() => new ContractVerifier(example).verifyEqualsSymmetric()).not.toThrow(VerificationError);
      });

      it('can determine that it is not symmetric', () => {
        const example = [new NotSymmetric(1), new NotSymmetric(2)];
        expect(() => new ContractVerifier(example).verifyEqualsSymmetric()).toThrow(VerificationError);
      });
    });

    describe('transitive', () => {
      it('can determine that it is transitivity', () => {
        const example = [new ValidHashable(1), new ValidHashable(2), new ValidHashable(3)];
        expect(() => new ContractVerifier(example).verifyEqualsTransitive()).not.toThrow(VerificationError);
      });

      it('can determine that it is not transitivity', () => {
        const example = [new NotTransitive(1), new NotTransitive(2), new NotTransitive(3)];
        expect(() => new ContractVerifier(example).verifyEqualsTransitive()).toThrow(VerificationError);
      });
    });

    describe('consistency', () => {
      it('can determine that it is consistent', () => {
        const example = [new ValidHashable(1), new ValidHashable(2), new ValidHashable(3)];
        expect(() => new ContractVerifier(example).verifyEqualsConsistent()).not.toThrow(VerificationError);
      });

      it('can determine that it is deterministically inconsistent', () => {
        const example = [new DeterministicallyInconsistentEquals(1), new DeterministicallyInconsistentEquals(2), new DeterministicallyInconsistentEquals(3)];
        expect(() => new ContractVerifier(example).verifyEqualsConsistent()).toThrow(VerificationError);
      });

      it('can determine that it is probabilistically inconsistent', () => {
        const example = [new ProbabilisticallyInconsistentEquals(1), new ProbabilisticallyInconsistentEquals(2), new ProbabilisticallyInconsistentEquals(3)];
        expect(() => new ContractVerifier(example).verifyEqualsConsistent()).toThrow(VerificationError);
      });
    });
  });

  describe('total hashCode verification', () => {
    it('passes', () => {
      const example = [new ValidHashable(1), new ValidHashable(2), new ValidHashable(3)];
      expect(() => new ContractVerifier(example).verifyHashCodeContract()).not.toThrow(VerificationError);
    });

    it('can determine that it is deterministically generally inconsistent', () => {
      const example = [new DeterministicallyInconsistentHashCode(1), new DeterministicallyInconsistentHashCode(2), new DeterministicallyInconsistentHashCode(3)];
      expect(() => new ContractVerifier(example).verifyHashCodeContract()).toThrow(VerificationError);
    });

    it('can determine that it is probabilistically generally inconsistent', () => {
      const example = [new ProbabilisticallyInconsistentHashCode(1), new ProbabilisticallyInconsistentHashCode(2), new ProbabilisticallyInconsistentHashCode(3)];
      expect(() => new ContractVerifier(example).verifyHashCodeContract()).toThrow(VerificationError);
    });

    it('can determine that it is equals inconsistent', () => {
      const example = [new InconsistentWithEqualsHashCode(1), new InconsistentWithEqualsHashCode(2), new InconsistentWithEqualsHashCode(3)];
      expect(() => new ContractVerifier(example).verifyHashCodeContract()).toThrow(VerificationError);
    });

  });

  describe('singular hashCode methods', () => {
    describe('general consistency', () => {
      it('can determine that it is consistent', () => {
        const example = [new ValidHashable(1), new ValidHashable(2), new ValidHashable(3)];
        expect(() => new ContractVerifier(example).verifyHashCodeGeneralConsistency()).not.toThrow(VerificationError);
      });

      it('can determine that it is deterministically inconsistent', () => {
        const example = [new DeterministicallyInconsistentHashCode(1), new DeterministicallyInconsistentHashCode(2), new DeterministicallyInconsistentHashCode(3)];
        expect(() => new ContractVerifier(example).verifyHashCodeGeneralConsistency()).toThrow(VerificationError);
      });

      it('can determine that it is probabilistically inconsistent', () => {
        const example = [new ProbabilisticallyInconsistentHashCode(1), new ProbabilisticallyInconsistentHashCode(2), new ProbabilisticallyInconsistentHashCode(3)];
        expect(() => new ContractVerifier(example).verifyHashCodeGeneralConsistency()).toThrow(VerificationError);
      });
    });

    describe('equals consistency', () => {
      it('can determine that it is consistent', () => {
        const example = [new ValidHashable(1), new ValidHashable(2), new ValidHashable(3)];
        expect(() => new ContractVerifier(example).verifyHashCodeEqualsConsistency()).not.toThrow(VerificationError);
      });

      it('can determine that it is inconsistent', () => {
        const example = [new InconsistentWithEqualsHashCode(1), new InconsistentWithEqualsHashCode(2), new InconsistentWithEqualsHashCode(3)];
        expect(() => new ContractVerifier(example).verifyHashCodeEqualsConsistency()).toThrow(VerificationError);
      });
    });

    describe('Warnings', () => {
      it('equals reflexive when no example', () => {
        expect(() => new ContractVerifier().verifyEqualsReflexive()).toThrow(NotExtensiveExampleError);
      });

      it('equals reflexive does not warn when one example is given', () => {
        expect(() => new ContractVerifier([new ValidHashable(3)]).verifyEqualsReflexive()).not.toThrow(NotExtensiveExampleError);
      });

      it('equals symmetric when no example', () => {
        expect(() => new ContractVerifier().verifyEqualsSymmetric()).toThrow(NotExtensiveExampleError);
      });

      it('equals symmetric when one example', () => {
        expect(() => new ContractVerifier([new ValidHashable(1)]).verifyEqualsSymmetric()).toThrow(NotExtensiveExampleError);
      });

      it('equals symmetric does not warn when two example are given', () => {
        expect(() => new ContractVerifier([new ValidHashable(3), new ValidHashable(4)]).verifyEqualsSymmetric()).not.toThrow(NotExtensiveExampleError);
      });

      it('equals transitive when no example', () => {
        expect(() => new ContractVerifier().verifyEqualsTransitive()).toThrow(NotExtensiveExampleError);
      });

      it('equals transitive when one example is given', () => {
        expect(() => new ContractVerifier([new ValidHashable(1)]).verifyEqualsTransitive()).toThrow(NotExtensiveExampleError);
      });

      it('equals transitive when two examples are given', () => {
        expect(() => new ContractVerifier([new ValidHashable(1), new ValidHashable(2)]).verifyEqualsTransitive()).toThrow(NotExtensiveExampleError);
      });

      it('equals transitive does not warn when three example are given', () => {
        expect(() => new ContractVerifier([new ValidHashable(3), new ValidHashable(4), new ValidHashable(5)]).verifyEqualsTransitive()).not.toThrow(NotExtensiveExampleError);
      });

      it('equals consistent when no example', () => {
        expect(() => new ContractVerifier().verifyEqualsConsistent()).toThrow(NotExtensiveExampleError);
      });

      it('hashCode general consistent when no example', () => {
        expect(() => new ContractVerifier().verifyHashCodeGeneralConsistency()).toThrow(NotExtensiveExampleError);
      });

      it('hashCode general consistent does not warn when one example is given', () => {
        expect(() => new ContractVerifier([new ValidHashable(5)]).verifyHashCodeGeneralConsistency()).not.toThrow(NotExtensiveExampleError);
      });

      it('hashCode equals consistent when no example', () => {
        expect(() => new ContractVerifier().verifyHashCodeEqualsConsistency()).toThrow(NotExtensiveExampleError);
      });

      it('hashCode equals consistent does warn when no equal pair is found', () => {
        expect(() => new ContractVerifier([new NotReflexive(5), new NotReflexive(5)]).verifyHashCodeEqualsConsistency()).toThrow(NotExtensiveExampleError);
      });

      it('hashCode equals consistent does not warn when at least one pair is equal', () => {
        expect(() => new ContractVerifier([new NotReflexive(5), new NotReflexive(6)]).verifyHashCodeEqualsConsistency()).not.toThrow(NotExtensiveExampleError);
      });
    });
  });
});
