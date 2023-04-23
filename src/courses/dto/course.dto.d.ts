import { PgCourseType } from '../course.entity';
import { Faculty } from 'src/users/user.entity';
export declare class CreateCourseDto {
    id: string;
    title: string;
    description: string;
    price: string;
    discountPricePercentage: string;
    pgCourseType: PgCourseType;
    faculty: Faculty;
    startDate: string;
    endDate: string;
}
