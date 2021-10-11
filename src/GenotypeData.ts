import { GenotypeLine } from './GenotypeLine';

export interface GenotypeData {
    lines: GenotypeLine[];
    producer: string | null,
    date: string | null,
    grcBuildVersion: number | null,
}
