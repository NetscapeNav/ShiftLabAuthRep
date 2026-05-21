import './AuthField.css'

type AuthFieldProps = {
    error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function AuthField({ error, className = '', ...props }: AuthFieldProps) {
    return (
        <label className="auth-field">
            <input
                className={`auth-input ${error ? 'auth-input-error' : ''} ${className}`}
                {...props}
            />
            {error && <span className="auth-error">{error}</span>}
        </label>
    );
}

export default AuthField;