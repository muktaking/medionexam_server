import { PipeTransform } from '@nestjs/common';
import { Stem } from '../stem.entity';
export declare class StemValidationPipe implements PipeTransform {
    transform(stem: any): {
        stem: Stem;
        error: string;
    };
}
