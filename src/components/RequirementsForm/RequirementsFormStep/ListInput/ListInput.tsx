import './ListInput.scss';
import TextField from "@mui/material/TextField";
import {DishDifficulty, MealType} from "../../../../enums.ts";
import AddIcon from '@mui/icons-material/Add';
import {IconButton} from "@mui/material";
import {useState} from "react";

type ListInputProps = {
    label: string;
    key:string;
    description: string;
    handleChange: (key:string, value:string | number | boolean | string[] | DishDifficulty | MealType) => void;
    values: string[];
}
function ListInput({label, key, description, handleChange, values}: ListInputProps) {
    const [value, setValue] = useState('');

    const handleSubmit = () => {
        handleChange(key, values.concat(value));
    }

    return (
        <div className="list-input">
            <div className="list-input__header">
                <h3 >{label}</h3>
                <p>{description}</p>
            </div>
            <div className="list-input__container">
                <TextField sx={{width:'100%'}} onChange={(e) => setValue(e.target.value)}/>
                <IconButton onClick={handleSubmit}>
                    <AddIcon/>
                </IconButton>
            </div>
            <ul className="list-input__list">
                {values && values.map((value) => (
                    <li key={value} className="list-input__list__item">
                        {value}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ListInput;