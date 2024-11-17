import './Navbar.scss';
import RamenDiningIcon from '@mui/icons-material/RamenDining';

function Navbar(props) {
    return (
        <div className="navbar">
            <div className="navbar__container container">
                <a href="/" className="navbar__container__identity">
                    <RamenDiningIcon sx={{width: "64px", height: "64px"}}/>
                    <div className="navbar__container__identity__name">Foodie</div>
                </a>
            </div>

        </div>
    );
}

export default Navbar;