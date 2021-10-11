// See https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
const patchPrototype = <T extends Error>(instance: T, target: any) => {
    const proto = target.prototype;
    if (Object.setPrototypeOf) {
        Object.setPrototypeOf(instance, proto);
    } else {
        (this as any).__proto__ = proto; // eslint-disable-line no-proto
    }
};

export abstract class ErrorGenotypeBase extends Error {
    protected constructor(message?: string) {
        super(message);
        patchPrototype(this, new.target);
    }
}

export class ErrorTokenization extends ErrorGenotypeBase {
    constructor(message: string, public readonly lineNumber: number, public readonly line: string) {
        super(message);
        patchPrototype(this, new.target);
    }
}

export class ErrorParse extends ErrorGenotypeBase {
    constructor(message: string, public readonly lineNumber: number) {
        super(message);
        patchPrototype(this, new.target);
    }
}
