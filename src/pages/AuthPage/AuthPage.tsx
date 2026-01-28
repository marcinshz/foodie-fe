import './AuthPage.scss';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useAppStore} from "../../store.ts";
import {login, register} from "../../DataService.ts";

enum FormErrors {
    emailTaken= "Email is already taken",
    invalidLoginCredentials = "Invalid login credentials",
}

enum AuthModes {
    login = "login",
    register = "register"
}

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

function isValidEmail(email: string): boolean {
    return emailRegex.test(email);
}

function AuthPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mode, setMode] = useState(AuthModes.login);
    const navigate = useNavigate();
    const [error, setError] = useState<FormErrors | undefined>();
    const setAuthData = useAppStore((state) => state.setAuthData);

    const handleSubmit = async () => {
        if (mode === AuthModes.login) {
            try {
                const data = await login(email, password);
                setAuthData(data);
            } catch (e) {
                setError(FormErrors.invalidLoginCredentials);
                return;
            }
        } else {
            try {
                const data = await register(email, password);
                setAuthData(data);
            } catch (e) {
                setError(FormErrors.emailTaken);
                return;
            }
        }
        navigate('/home');
    }

    const handleModeChange = (newMode: AuthModes) => {
        setMode(newMode);
        setError(undefined);
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && password.length && email.length && isValidEmail(email)) {
            handleSubmit();
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-page__background">
                <div className="auth-page__background__shape auth-page__background__shape--1"></div>
                <div className="auth-page__background__shape auth-page__background__shape--2"></div>
            </div>
            
            <div className="auth-page__container container">
                <div className="auth-page__branding">
                    <div className="auth-page__branding__icon">
                        <RestaurantIcon sx={{fontSize: '3rem', color: '#fff'}}/>
                    </div>
                    <h1 className="auth-page__branding__title">Welcome to Foodie</h1>
                    <p className="auth-page__branding__subtitle">
                        Your personal AI chef for creating delicious recipes tailored to your taste
                    </p>
                </div>

                <div className="auth-page__card">
                    <div className="auth-page__card__header">
                        <h2>{mode === AuthModes.login ? 'Welcome Back' : 'Create Account'}</h2>
                        <p>{mode === AuthModes.login ? 'Sign in to continue your culinary journey' : 'Join us and start exploring amazing recipes'}</p>
                    </div>

                    <div className="auth-page__card__mode-selector">
                        <button
                            className={`auth-page__card__mode-selector__button ${mode === AuthModes.login ? 'active' : ''}`}
                            onClick={() => handleModeChange(AuthModes.login)}
                        >
                            Sign In
                        </button>
                        <button
                            className={`auth-page__card__mode-selector__button ${mode === AuthModes.register ? 'active' : ''}`}
                            onClick={() => handleModeChange(AuthModes.register)}
                        >
                            Sign Up
                        </button>
                    </div>

                    <div className="auth-page__card__form">
                        <div className="auth-page__card__form__field">
                            <label htmlFor="email">Email Address</label>
                            <TextField
                                id="email"
                                variant="outlined"
                                type="email"
                                placeholder="your.email@example.com"
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyPress={handleKeyPress}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailIcon sx={{color: 'rgba(0, 0, 0, 0.4)'}}/>
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '0.75rem',
                                        backgroundColor: 'rgba(117, 123, 200, 0.03)',
                                        '&:hover fieldset': {
                                            borderColor: 'rgba(117, 123, 200, 0.3)',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#757bc8',
                                        },
                                    },
                                }}
                            />
                        </div>

                        <div className="auth-page__card__form__field">
                            <label htmlFor="password">Password</label>
                            <TextField
                                id="password"
                                variant="outlined"
                                type="password"
                                placeholder="Enter your password"
                                fullWidth
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyPress={handleKeyPress}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon sx={{color: 'rgba(0, 0, 0, 0.4)'}}/>
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '0.75rem',
                                        backgroundColor: 'rgba(117, 123, 200, 0.03)',
                                        '&:hover fieldset': {
                                            borderColor: 'rgba(117, 123, 200, 0.3)',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#757bc8',
                                        },
                                    },
                                }}
                            />
                        </div>

                        {error && (
                            <div className="auth-page__card__form__error">
                                <span>⚠️</span>
                                <p>{error}</p>
                            </div>
                        )}

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            onClick={handleSubmit}
                            disabled={!password.length || !email.length || !isValidEmail(email)}
                            sx={{
                                marginTop: '1rem',
                                padding: '0.875rem',
                                borderRadius: '0.75rem',
                                fontSize: '1rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                background: 'linear-gradient(90deg, #757bc8 0%, #9fa3d4 100%)',
                                boxShadow: '0 4px 12px rgba(117, 123, 200, 0.3)',
                                '&:hover': {
                                    background: 'linear-gradient(90deg, #6a70b8 0%, #8e92c4 100%)',
                                    boxShadow: '0 6px 16px rgba(117, 123, 200, 0.4)',
                                },
                                '&:disabled': {
                                    background: 'rgba(0, 0, 0, 0.12)',
                                    boxShadow: 'none',
                                },
                            }}
                        >
                            {mode === AuthModes.login ? 'Sign In' : 'Create Account'}
                        </Button>
                    </div>

                    <div className="auth-page__card__footer">
                        <p>
                            {mode === AuthModes.login ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={() => handleModeChange(mode === AuthModes.login ? AuthModes.register : AuthModes.login)}
                                className="auth-page__card__footer__link"
                            >
                                {mode === AuthModes.login ? 'Sign up' : 'Sign in'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthPage;