import './Button.css'

type ButtonProps = {
    children: React.ReactNode;
    isLoading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ children, isLoading = false, disabled, ...props }: ButtonProps) {
    return (
        <button className="auth-button" disabled={disabled || isLoading} {...props}>
            {isLoading ? "Загрузка..." : children}
        </button>
    );
}

export default Button
