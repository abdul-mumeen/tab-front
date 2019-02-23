import { User } from 'firebase';

export interface UserModel extends User {
    role?: string;
    name?: string;
}

export interface TableSelect {
    displayName: string;
    value: string;
}
