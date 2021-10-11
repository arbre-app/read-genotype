import { describe, it } from 'mocha';
import * as fs from 'fs';
import { readGenotype } from '../src';

describe('Read sample files', () => {
    it('should read a collection of sample files without error', () => {
        const directory = 'tests/data';
        fs.readdirSync(directory).filter(s => s.endsWith('.txt')).forEach(filename => {
            const path = `${directory}/${filename}`;
            readGenotype(fs.readFileSync(path, { encoding: 'utf-8' }));
        });
    }).timeout(10 * 60 * 1000);
});
