import {DishDifficulty, MealType} from "../../../../enums.ts";
import Checkbox from '@mui/material/Checkbox';
import './CheckboxInput.scss'

type CheckboxInputProps = {
    label: string;
    stateKey:string;
    description: string;
    handleChange: (key:string, value:string | number | boolean | string[] | DishDifficulty | MealType) => void;
    value:boolean;
}
function CheckboxInput({label, stateKey, description, handleChange, value}: CheckboxInputProps) {

    return (
        <div className="checkbox-input">
            <div className="checkbox-input__header">
                <h3>{label}</h3>
                <p>{description}</p>
            </div>
            <div className="checkbox-input__container">
                <Checkbox checked={value} onChange={(e) => handleChange(stateKey, !value)}/>
            </div>
        </div>
    );
}

export default CheckboxInput;