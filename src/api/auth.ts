import { apiRequest } from './client';

type User = {
    _id: string;
    phone: string;
    firstname: string;
    middlename: string;
    lastname: string;
    email: string;
    city: string;
};

export type OtpResponse = {
    success: boolean;
    reason?: string;
    retryDelay?: number;
};

export type SignInResponse = {
    success: boolean;
    reason?: string;
    user: User;
    token: string;
};

export type SessionResponse = {
    success: boolean;
    reason?: string;
    user: User;
};

export function requestOtp(phone: string) {
    return apiRequest<OtpResponse>('/auth/otp', {
        method: 'POST',
        body: JSON.stringify({ phone }),
    });
}

export function signIn(phone: string, code: string) {
    return apiRequest<SignInResponse>('/users/signin', {
        method: 'POST',
        body: JSON.stringify({
            phone,
            code: Number(code),
        }),
    });
}

export function getSession(token: string) {
    return apiRequest<SessionResponse>('/users/session', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}