import TextField from "@mui/material/TextField";
import {DishDifficulty, MealType} from "../../../../enums.ts";
import {MenuItem, Select} from "@mui/material";
import {DishDifficultyLevels, MealTypes} from "../../../../constants.ts";

type TextInputProps = {
    label: string;
    stateKey:string;
    description: string;
    handleChange: (key:string, value:string | number | boolean | string[] | DishDifficulty | MealType) => void;
    value:DishDifficulty | MealType;
}
function SelectInput({label, stateKey, description, handleChange, value}: TextInputProps) {
    const options = stateKey === "difficulty" ? DishDifficultyLevels : MealTypes

    return (
        <div className="select-input">
            <div className="select-input__header">
                <h3>{label}</h3>
                <p>{description}</p>
            </div>
            <div className="select-input__container">
                <Select
                    sx={{width:'100%'}}
                    value={value}
                    onChange={(e) => handleChange(stateKey, e.target.value as DishDifficulty | MealType)}
                >
                    {options.map((option) => (
                        <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                </Select>
            </div>
        </div>
    );
}

export default SelectInput;