import { BaseEntity, Timestamp } from 'typeorm';
import { AccessRight } from './accessRight.entity';
export declare enum RolePermitted {
    guest = 0,
    student = 1,
    mentor = 2,
    moderator = 3,
    coordinator = 4,
    admin = 5
}
export declare enum Faculty {
    all = 0,
    basic = 1,
    medicine = 2,
    surgery = 3,
    gynecology = 4,
    paediatrics = 5
}
export declare enum LoginProvider {
    local = 0,
    facebook = 1,
    google = 2
}
export declare enum IdentityStatus {
    unchecked = 0,
    checked = 1,
    unrequired = 2
}
export declare enum Gender {
    male = "male",
    female = "female"
}
export declare class User extends BaseEntity {
    id: number;
    fbId: string;
    firstName: string;
    lastName: string;
    userName: string;
    avatar: string;
    password: string;
    email: string;
    gender: Gender;
    role: RolePermitted;
    loginProvider: LoginProvider;
    identityStatus: IdentityStatus;
    mobile: string;
    institution: string;
    faculty: Faculty;
    address: string;
    createdAt: Timestamp;
    resetToken: string;
    resetTokenExpiration: Timestamp;
    accessRight: AccessRight;
    agreementId: string[];
}
