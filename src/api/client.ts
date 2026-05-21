const API_URL = import.meta.env.VITE_API_URL;

type ApiError = {
    success?: boolean;
    reason?: string;
    message?: string;
}

function getStatusMessage(status: number) {
    switch (status) {
        case 400: return 'Проверьте введённые данные';
        case 401: return 'Неверный код подтверждения';
        case 404: return 'Метод API не найден';
        case 500: return 'Сервер временно недоступен. Попробуйте позже';
        default: return 'Что-то пошло не так';
    }
}

export async function apiRequest<T>(path: string, options: RequestInit): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        }
    });

    const data = (await response.json().catch(() => null)) as ApiError | T | null;

    if (!response.ok) {
        const apiMessage =
            data && 'reason' in data && data.reason
                ? data.reason
                : data && 'message' in data && data.message
                    ? data.message
                    : null;

        throw new Error(apiMessage ?? getStatusMessage(response.status));
    }

    if (data && 'success' in data && data.success === false) {
        throw new Error(data.reason ?? data.message ?? 'Что-то пошло не так');
    }

    return data as T;
}