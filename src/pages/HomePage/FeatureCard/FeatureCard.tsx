import './FeatureCard.scss';
import {Link} from "react-router-dom";
import Icon from '@mui/material/Icon';

type FeatureCardProps = {
    header:string;
    paragraph:string;
    path:string;
    icon:string;
}
function FeatureCard({header, paragraph, path, icon}:FeatureCardProps) {
    return (
        <Link to={path}>
            <div className="feature-card">
                <Icon sx={{fontSize:'4rem'}}>{icon}</Icon>
                <h2 className="feature-card__header">{header}</h2>
                <p className="feature-card__paragraph">{paragraph}</p>
            </div>
        </Link>
    );
}

export default FeatureCard;