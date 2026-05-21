import { useEffect, useState } from 'react';
import './App.css';
import { requestOtp, signIn, getSession } from './api/auth';
import { AuthField } from './components/AuthField';
import { Button } from './components/Button';

type Step = 'phone' | 'otp' | 'success';

function App() {
    const [step, setStep] = useState<Step>('phone');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [retrySeconds, setRetrySeconds] = useState(0);
    const [phoneError, setPhoneError] = useState('');
    const [otpError, setOtpError] = useState('');
    const [isOtpLoading, setIsOtpLoading] = useState(false);
    const [isSignInLoading, setIsSignInLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    useEffect(() => {
        if (retrySeconds <= 0) {
            return;
        }

        const timerId = window.setTimeout(() => {
            setRetrySeconds((seconds) => seconds - 1);
        }, 1000);

        return () => window.clearTimeout(timerId);
    }, [retrySeconds]);

    const handlePhoneChange = (value: string) => {
        setPhone(value.replace(/\D/g, ''));
        setPhoneError('');
        setApiError('');
    };

    const handleOtpChange = (value: string) => {
        setOtp(value.replace(/\D/g, '').slice(0, 6));
        setOtpError('');
        setApiError('');
    };

    const handlePhoneSubmit = async () => {
        if (!phone) {
            setPhoneError('Поле является обязательным');
            return;
        }

        setIsOtpLoading(true);
        setApiError('');

        try {
            const response = await requestOtp(phone);
            const retryDelaySeconds = response.retryDelay ? Math.ceil(response.retryDelay / 1000) : 60;

            setRetrySeconds(retryDelaySeconds);
            setStep('otp');
        } catch (error) {
            setApiError(error instanceof Error ? error.message : 'Не удалось отправить код');
        } finally {
            setIsOtpLoading(false);
        }
    };

    const handleRepeatOtp = async () => {
        if (retrySeconds > 0 || isOtpLoading) {
            return;
        }

        setIsOtpLoading(true);
        setApiError('');

        try {
            const response = await requestOtp(phone);
            const retryDelaySeconds = response.retryDelay ? Math.ceil(response.retryDelay / 1000) : 60;

            setOtp('');
            setOtpError('');
            setRetrySeconds(retryDelaySeconds);
        } catch (error) {
            setApiError(error instanceof Error ? error.message : 'Не удалось отправить код повторно');
        } finally {
            setIsOtpLoading(false);
        }
    };

    const handleOtpSubmit = async () => {
        if (otp.length !== 6) {
            setOtpError('Код должен содержать 6 цифр');
            return;
        }

        setIsSignInLoading(true);
        setApiError('');

        try {
            const response = await signIn(phone, otp);

            localStorage.setItem('shift_token', response.token);
            await getSession(response.token);

            setStep('success');
        } catch (error) {
            setApiError(error instanceof Error ? error.message : 'Не удалось войти');
        } finally {
            setIsSignInLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('shift_token');
        setPhone('');
        setOtp('');
        setPhoneError('');
        setOtpError('');
        setApiError('');
        setRetrySeconds(0);
        setStep('phone');
    };

    return (
        <main className="page">
            <section className="auth">
                {step === 'phone' && (
                    <>
                        <h1 className="auth-title">Вход</h1>

                        <p className="auth-description">
                            Введите номер телефона для входа<br />
                            в личный кабинет
                        </p>

                        <AuthField
                            error={phoneError}
                            value={phone}
                            onChange={(event) => handlePhoneChange(event.target.value)}
                            type="tel"
                            placeholder="Телефон"
                            inputMode="numeric"
                        />

                        <Button type="button" onClick={handlePhoneSubmit} isLoading={isOtpLoading}>
                            Продолжить
                        </Button>

                        {apiError && <p className="auth-error">{apiError}</p>}
                    </>
                )}

                {step === 'otp' && (
                    <>
                        <h1 className="auth-title">Вход</h1>

                        <p className="auth-description">
                            Введите проверочный код для входа<br />
                            в личный кабинет
                        </p>

                        <AuthField value={phone} type="tel" placeholder="Телефон" inputMode="numeric" readOnly />

                        <AuthField
                            error={otpError}
                            value={otp}
                            onChange={(event) => handleOtpChange(event.target.value)}
                            type="text"
                            placeholder="Код подтверждения"
                            inputMode="numeric"
                            maxLength={6}
                        />

                        <Button type="button" onClick={handleOtpSubmit} isLoading={isSignInLoading}>
                            Войти
                        </Button>

                        {apiError && <p className="auth-error">{apiError}</p>}

                        {retrySeconds > 0 ? (
                            <p className="auth-retry-text">
                                Запросить код повторно можно через {retrySeconds} секунд
                            </p>
                        ) : (
                            <button className="auth-repeat" type="button" onClick={handleRepeatOtp}>
                                {isOtpLoading ? 'Отправляем...' : 'Запросить код ещё раз'}
                            </button>
                        )}
                    </>
                )}

                {step === 'success' && (
                    <>
                        <h1 className="auth-title">Вы вошли</h1>

                        <p className="auth-description">Авторизация прошла успешно</p>

                        <Button type="button" onClick={handleLogout}>
                            Выйти
                        </Button>
                    </>
                )}
            </section>
        </main>
    );
}

export default App;