export declare enum UserRole {
    ADMIN = "admin",
    BROKER = "broker",
    INVESTOR = "investor"
}
export declare enum UserStatus {
    PENDING = "pending",
    ACTIVE = "active",
    SUSPENDED = "suspended"
}
export declare class User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    nationalId: string;
    role: UserRole;
    status: UserStatus;
    avatarUrl: string;
    csdAccountNumber: string;
    createdAt: Date;
    updatedAt: Date;
    get fullName(): string;
}
