import { QType } from 'src/questions/question.entity';
import { Stem } from 'src/questions/stem.entity';
export interface Particulars {
    id: string;
    qText: string;
    stems: Stem;
    generalFeedback: string;
    result: Result;
}
export interface Result {
    stemResult?: any;
    mark: number;
}
export interface StudentAnswer {
    id: string;
    stems: Array<string>;
    type: QType;
}
