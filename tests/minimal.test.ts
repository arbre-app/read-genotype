import { describe, it } from 'mocha';
import { readGenotype } from '../src';
import { expect } from 'chai';

describe('Read sample files', () => {
    const sampleContent = [
        '# This data file generated by 23andMe at: Mon Jan 02 12:34:56 2013',
        '#',
        '# Below is a text version of your data.  Fields are TAB-separated',
        '# Each line corresponds to a single SNP.  For each SNP, we provide its identifier ',
        '# (an rsid or an internal id), its location on the reference human genome, and the ',
        '# genotype call oriented with respect to the plus strand on the human reference sequence.',
        '# We are using reference human assembly build 37 (also known as Annotation Release 104).',
        '# Note that it is possible that data downloaded at different times may be different due to ongoing ',
        '# improvements in our ability to call genotypes. More information about these changes can be found at:',
        '# https://www.23andme.com/you/download/revisions/',
        '# ',
        '# More information on reference human assembly build 37 (aka Annotation Release 104):',
        '# http://www.ncbi.nlm.nih.gov/mapview/map_search.cgi?taxid=9606',
        '#',
        '# rsid\tchromosome\tposition\tgenotype',
        'rs4477212\t1\t82154\tAA',
        'rs3094315\t1\t752566\tAG',
    ].map(s => s + '\n').join('');

    it('should produce a correct result for a minimal file', () => {
        const data = readGenotype(sampleContent);

        expect(data.producer).to.equal('23andMe');
        expect(data.date).to.equal(new Date('Mon Jan 02 12:34:56 2013').toISOString());
        expect(data.grcBuildVersion).to.equal(37);
        expect(data.lines).to.deep.equal([
            { rsid: 'rs4477212', chromosome: '1', position: 82154, genotype: 'AA' },
            { rsid: 'rs3094315', chromosome: '1', position: 752566, genotype: 'AG' },
        ]);
    });
});
