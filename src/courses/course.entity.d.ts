import { Faculty } from 'src/users/user.entity';
import { BaseEntity, Timestamp } from 'typeorm';
export declare enum PgCourseType {
    All = 0,
    Fellowship = 1,
    Residency = 2,
    Diploma = 3,
    MembershipOfRoyalColledge = 4,
    Usmle = 5,
    Others = 6
}
export declare class Course extends BaseEntity {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    price: number;
    discountPricePercentage: number;
    createdAt: Timestamp | string;
    startDate: Timestamp | string;
    endDate: Timestamp | string;
    creatorId: number;
    expectedEnrolledStuIds: number[];
    enrolledStuIds: number[];
    pgCourseType: PgCourseType;
    faculty: Faculty;
}
