import { ErrorTokenization } from './error';

const sSeparator = '\t';
const gNumber = '(?:0|[1-9][0-9]*)';
const gBase = '[ACGT]';
const gBaseOpt = `${gBase}{1,2}|-{1,2}|[DI]{1,2}|DI`;
const sComment = '#';
const gComment = `${sComment} ?(.*?)`;
const gHeader = ['rsid', 'chromosome', 'position', 'genotype'].join(sSeparator);
const gHeaderComment = `${sComment} (${gHeader})`;
const gData = `([a-z]+${gNumber})${sSeparator}(${gNumber}|[XY]|MT)${sSeparator}(${gNumber})${sSeparator}(${gBaseOpt})`;
const gGeno = `(?:${gHeaderComment}|${gComment}|${gData})\r?\n`;

class GenotypeTokenizer implements IterableIterator<RegExpExecArray> {
    private rLines = new RegExp(`^${gGeno}`, 'gym'); // Must be newly created
    private linesRead = 0;
    private charactersRead = 0;

    constructor(private readonly input: string, private readonly strict: boolean) {} // eslint-disable-line no-useless-constructor

    [Symbol.iterator](): IterableIterator<RegExpExecArray> {
        return this;
    }

    next(): IteratorResult<RegExpExecArray, null> {
        const result = this.rLines.exec(this.input);
        if (result === null) {
            const success = this.charactersRead === this.input.length;
            if (this.strict && !success) {
                const printCharactersMax = 256;
                const errorLine = this.input.substring(this.charactersRead, Math.min(this.charactersRead + printCharactersMax, this.input.length)).split(/[\r\n]+/, 1)[0];
                throw new ErrorTokenization(`Invalid format for line ${this.linesRead + 1}: "${errorLine}"`, this.linesRead + 1, errorLine);
            }

            return { done: true, value: null }; // Return
        } else {
            this.charactersRead += result[0].length; // Includes terminator
            this.linesRead++;
            return { done: false, value: result }; // Yield
        }
    }
}

export const tokenize = (input: string, strict = true): Iterable<RegExpExecArray> => new GenotypeTokenizer(input, strict);
