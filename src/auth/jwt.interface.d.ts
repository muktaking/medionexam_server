import { RolePermitted } from 'src/users/user.entity';
export interface jwtPayload {
    email: string;
    id: string;
    role: RolePermitted;
}
