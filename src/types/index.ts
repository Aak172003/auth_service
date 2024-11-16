import { Request } from "express";

export interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}
export interface RegisterUserRequest extends Request {
    body: UserData;
}

export interface LoginUserRequest extends Request {
    body: UserData;
}

export interface AuthRequest extends Request {
    auth: {
        sub: string;
        role: string;

        // this ? represents id is optional
        id?: string;
    };
}

export type AuthCookie = {
    accessToken: string;
    refreshToken: string;
};

export interface RefreshTokenPayload {
    id: string;
}

export interface ITenant {
    name: string;
    address: string;
}

export interface CreateTenantRequest extends Request {
    body: ITenant;
}
