import { useEffect, useState } from 'react'
import './App.css'
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
    }

    const handleOtpChange = (value: string) => {
        setOtp(value.replace(/\D/g, '').slice(0, 6));
        setOtpError('');
    }

    const handlePhoneSubmit = async () => {
        if (!phone) {
            setPhoneError('Поле является обязательным');
            return;
        }

        setIsOtpLoading(true);
        setApiError('');

        await new Promise((resolve) => setTimeout(resolve, 700));

        setIsOtpLoading(false);
        setRetrySeconds(60);
        setStep('otp');
    }

    const handleRepeatOtp = async () => {
        if (retrySeconds > 0 || isOtpLoading) {
            return;
        }

        setIsOtpLoading(true);
        setApiError('');

        await new Promise((resolve) => setTimeout(resolve, 700));

        setOtp('');
        setOtpError('');
        setIsOtpLoading(false);
        setRetrySeconds(60);
    };

    const handleOtpSubmit = async () => {
        if (otp.length !== 6) {
            setOtpError('Код должен содержать 6 цифр');
            return;
        }

        setIsSignInLoading(true);
        setApiError('');

        await new Promise((resolve) => setTimeout(resolve, 700));

        if (otp !== '123456') {
            setApiError('Неверный код подтверждения');
            setIsSignInLoading(false);
            return;
        }

        setIsSignInLoading(false);
        setStep('success');
    };

    return (
    <main className="page">
      <section className="auth">
          {step === 'phone' && (
              <>
                  <h1 className="auth-title">Вход</h1>
                  <p className="auth-description">
                      Введите номер телефона для входа<br/>
                      в личный кабинет
                  </p>
                  <AuthField error={phoneError} value={phone} onChange={(e) => handlePhoneChange(e.target.value)}
                             type="tel" placeholder="Телефон" inputMode="numeric">
                  </AuthField>
                  <Button type="button" onClick={handlePhoneSubmit}
                          isLoading={isOtpLoading}>
                      Продолжить
                  </Button>
                  {apiError && <p className="auth-error">{apiError}</p>}
              </>
          )}
          {step === 'otp' && (
              <>
                  <h1 className="auth-title">Вход</h1>
                  <p className="auth-description">
                      Введите номер телефона для входа<br/>
                      в личный кабинет
                  </p>
                  <AuthField error={phoneError} value={phone} onChange={(e) => handlePhoneChange(e.target.value)}
                             type="tel" placeholder="Телефон" inputMode="numeric">
                  </AuthField>
                  <AuthField error={otpError} value={otp} onChange={(e) => handleOtpChange(e.target.value)}
                             type="number" placeholder="Код подтверждения" inputMode="numeric">
                  </AuthField>
                  <Button type="button" onClick={handleOtpSubmit}
                          isLoading={isSignInLoading}>
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
                  <p className="auth-description">
                      Авторизация прошла успешно
                  </p>
                  <Button type="button" onClick={() => setStep('phone')}>
                      Выйти
                  </Button>
              </>
          )}
      </section>
    </main>
    )
}

export default App
