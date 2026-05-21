import { useState } from 'react'
import './App.css'
import { getSession, requestOtp, signIn } from './api/auth';

type Step = 'phone' | 'otp' | 'success';

function App() {
    const [step, setStep] = useState<Step>('phone');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [otpError, setOtpError] = useState('');
    const [isOtpLoading, setIsOtpLoading] = useState(false);
    const [isSignInLoading, setIsSignInLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    const handlePhoneChange = (value: string) => {
        setPhone(value.replace(/\s/g, ''));
        setPhoneError('');
    }

    const handleOtpChange  = (value: string) => {
        setOtp(value.replace(/\s/g, '').slice(0, 6));
        setOtpError('');
    }

    const handlePhoneSubmit = async () => {
        if (!phone) {
            setPhoneError('Поле является обязательным');
            return;
        }

        setIsOtpLoading(true);
        setApiError('');

        try {
            await requestOtp(phone);
            setStep('otp');
        } catch (error) {
            setApiError(error instanceof Error ? error.message : "Не удалось отправить код");
        } finally {
            setIsOtpLoading(false);
        }
    }

    const handleOtpSubmit = async () => {
        if (otp.length !== 6) {
            setOtpError('Код должен содержать 6 цифр');
            return;
        }

        setIsSignInLoading(true);
        setApiError('');

        try {
            const responce = await signIn(phone, otp);

            if (responce.token) {
                localStorage.setItem('token', responce.token);
                await getSession(responce.token);
            }
            setStep('success');
        } catch (error) {
            setApiError(error instanceof Error ? error.message : "Не удалось войти");
        } finally {
            setIsSignInLoading(false);
        }
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
                  <label className="auth-field">
                      <input className={`auth-input ${phoneError ? 'auth-input-error' : ''}`}
                             value={phone} onChange={(e) => handlePhoneChange(e.target.value)}
                             type="tel" placeholder="Телефон" inputMode="numeric"/>
                      {phoneError && <span className="auth-error">{phoneError}</span>}
                  </label>
                  <button className="auth-button" type="button" onClick={handlePhoneSubmit}
                          disabled={isOtpLoading}>
                      {isOtpLoading ? "Отправляем..." : "Продолжить"}
                  </button>
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
                  <label className="auth-field">
                      <input className={`auth-input ${otpError ? 'auth-input-error' : ''}`}
                             value={phone} onChange={(e) => handlePhoneChange(e.target.value)}
                             type="tel" placeholder="Телефон" inputMode="numeric"/>
                      {phoneError && <span className="auth-error">{phoneError}</span>}
                      <input className={`auth-input ${otpError ? 'auth-input-error' : ''}`}
                             value={otp} onChange={(e) => handleOtpChange(e.target.value)}
                             type="number" placeholder="Код потверждения" inputMode="numeric" required/>
                      {otpError && <span className="auth-error">{otpError}</span>}
                  </label>
                  <button className="auth-button" onClick={handleOtpSubmit}
                          disabled={isSignInLoading}>
                      {isSignInLoading ? "Входим..." : "Войти"}
                  </button>
                  {apiError && <p className="auth-error">{apiError}</p>}
                  <button className="auth-repeat"  type="button"
                      onClick={() => {setOtp(''); setOtpError('');}}>
                      Запросить код ещё раз
                  </button>
              </>
          )}
          {step === 'success' && (
              <>
                  <h1 className="auth-title">Вы вошли</h1>
                  <p className="auth-description">
                      Авторизация прошла успешно
                  </p>
                  <button className="button" onClick={() => setStep('phone')}>
                      Выйти
                  </button>
              </>
          )}
      </section>
    </main>
    )
}

export default App
