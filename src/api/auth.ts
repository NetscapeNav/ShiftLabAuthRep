import { apiRequest } from './client';

type Response = {
    success: boolean;
    reason?: string;
};

type SignInResponse = Response & {
    token?: string;
};

type SessionResponse = Response & {
    user?: unknown;
};

export function requestOtp(phone: string) {
    return apiRequest<Response>('/auth/otp', {
        method: 'POST',
        body: JSON.stringify({ phone }),
    });
}

export function signIn(phone: string, code: string) {
    return apiRequest<SignInResponse>('/users/signin', {
        method: 'POST',
        body: JSON.stringify({ phone, code }),
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