import './AuthPage.scss';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import WavingHandIcon from '@mui/icons-material/WavingHand';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
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

    const handleModeChange = () => {
        setMode(mode === AuthModes.login ? AuthModes.register : AuthModes.login);
    }

    return (
        <div className="auth-page container">
            <div className="auth-page__text">
                <div className="auth-page__text__header">
                    <h1>Hi there!</h1>
                    <WavingHandIcon sx={{width: "56px", height: "56px", color: "#ffd60a"}}/>
                </div>
                <p className="auth-page__text__paragraph">
                    Create an account or log into existing one to get your tasty recipes
                </p>
            </div>
            <div className="auth-page__form">
                <Stack direction="row" spacing={1} sx={{alignItems: 'center', justifyContent: 'center'}}>
                    Log in
                    <Switch checked={mode === AuthModes.register} onChange={handleModeChange}
                            inputProps={{'aria-label': 'ant design'}}/>
                    Register
                </Stack>
                <Box>
                    <InputLabel htmlFor="email">
                        E-mail
                    </InputLabel>
                    <TextField
                        id="email"
                        variant="outlined"
                        type="email"
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon/>
                                    </InputAdornment>
                                ),
                            },
                        }}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Box>

                <Box>
                    <InputLabel htmlFor="password">
                        Password
                    </InputLabel>
                    <TextField
                        id="password"
                        variant="outlined"
                        type="password"
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon/>
                                    </InputAdornment>
                                ),
                            },
                        }}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Box>
                {error && <p className="auth-page__form__error">{error}</p>}
                <Button
                    type="submit"
                    variant="contained"
                    sx={{backgroundColor: "#abc4ff", marginTop: "1rem"}}
                    onClick={handleSubmit}
                    disabled={!password.length || !email.length || !isValidEmail(email)}>
                    Submit
                </Button>
            </div>
        </div>
    );
}

export default AuthPage;