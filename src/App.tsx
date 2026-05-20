import { useState } from 'react'
import './App.css'

type Step = 'phone' | 'otp' | 'success';

function App() {
    const [step, setStep] = useState<Step>('phone');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [otpError, setOtpError] = useState('');

    const handlePhoneChange = (value: string) => {
        setPhone(value.replace(/\s/g, ''));
        setPhoneError('');
    }

    const handleOtpChange  = (value: string) => {
        setOtp(value.replace(/\s/g, '').slice(0, 6));
        setOtpError('');
    }

    const handlePhoneSubmit = () => {
        if (!phone) {
            setPhoneError('Поле является обязательным');
            return;
        }

        setStep('otp');
    }

    const handleOtpSubmit = () => {
        if (otp.length !== 6) {
            setOtpError('Код должен содержать 6 цифр');
            return;
        }

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
                  <label className="auth-field">
                      <input className={`auth-input ${phoneError ? 'auth-input-error' : ''}`}
                             value={phone} onChange={(e) => handlePhoneChange(e.target.value)}
                             type="tel" placeholder="Телефон" inputMode="numeric"/>
                      {phoneError && <span className="auth-error">{phoneError}</span>}
                  </label>
                  <button className="auth-button" type="button" onClick={handlePhoneSubmit}>
                      Продолжить
                  </button>
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
                  <button className="auth-button" onClick={handleOtpSubmit}>
                      Войти
                  </button>
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
