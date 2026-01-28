import {DishDifficulty, MealType} from "../../../../enums.ts";
import TextField from "@mui/material/TextField";

type NumberInputProps = {
    label: string;
    stateKey:string;
    description: string;
    handleChange: (key:string, value:string | number | boolean | string[] | DishDifficulty | MealType) => void;
    value:number;
}

//TOOD check if input is int
function NumberInput({label, stateKey, description, handleChange, value}: NumberInputProps) {

    return (
        <div className="number-input">
            <div className="number-input__header">
                <h3>{label}</h3>
                <p>{description}</p>
            </div>
            <div className="number-input__container">
                <TextField
                    inputMode="numeric"
                    type="number"
                    value={value}
                    onChange={(e) => handleChange(stateKey, parseInt(e.target.value))}
                    sx={{width:'100%'}}
                />
            </div>
        </div>
    );
}

export default NumberInput;