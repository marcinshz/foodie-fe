import './Navbar.scss';
import MenuIcon from '@mui/icons-material/Menu';
import {useState} from "react";
import CloseIcon from '@mui/icons-material/Close';
import Button from "@mui/material/Button";
import clsx from 'clsx'
import Logo from '../iconComponents/logo.tsx';
import {useAppStore} from "../../store.ts";

function Navbar() {
    //const [menuOpen, setMenuOpen] = useState(false);
    const {authData, removeAuthData} = useAppStore((state) => state);

    return (
        <div className={clsx("navbar"/*, menuOpen && "navbar--open"*/)}>
            <div className="navbar__container container">
                <div>
                    <a href="/" className="navbar__container__identity">
                        {/*<RamenDiningIcon sx={{width: "64px", height: "64px"}}/>*/}
                        <Logo/>
                        <div className="navbar__container__identity__name">Foodie</div>
                    </a>
{/*                    <button className="navbar__container__toggle" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <CloseIcon sx={{width: "32px", height: "32px"}}/> :
                            <MenuIcon sx={{width: "32px", height: "32px"}}/>}
                    </button>*/}
                </div>
                {authData && <div className="navbar__container__menu">
{/*                    <div className="navbar__container__menu__links">
                        <a href="/" className="navbar__container__menu__links__item">Lorem</a>
                        <a href="/" className="navbar__container__menu__links__item">Ipsum</a>
                        <a href="/" className="navbar__container__menu__links__item">Lorem</a>
                        <a href="/" className="navbar__container__menu__links__item">Ipsum</a>
                    </div>*/}
                    <Button
                        variant="outlined"
                        onClick={removeAuthData}
                        sx={{color: "#fff", borderColor: "#fff", minWidth: "7rem", '&:hover': {background: "#8e94f2"}}}
                    >Sign Out</Button>
                </div>}
            </div>
        </div>
    );
}

export default Navbar;