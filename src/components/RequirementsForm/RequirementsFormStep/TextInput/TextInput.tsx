import {DishDifficulty, MealType} from "../../../../enums.ts";
import TextField from "@mui/material/TextField";

type TextInputProps = {
    label: string;
    stateKey:string;
    description: string;
    handleChange: (key:string, value:string | number | boolean | string[] | DishDifficulty | MealType) => void;
    value:string;
}
function TextInput({label, stateKey, description, handleChange, value}: TextInputProps) {
    return (
        <div className="text-input">
            <div className="text-input__header">
                <h3>{label}</h3>
                <p>{description}</p>
            </div>
            <div className="text-input__container">
                <TextField sx={{width:'100%'}} value={value} onChange={(e) => handleChange(stateKey, e.target.value)}/>
            </div>
        </div>
    );
}

export default TextInput;