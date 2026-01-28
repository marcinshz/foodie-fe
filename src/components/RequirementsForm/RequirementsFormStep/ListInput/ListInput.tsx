import './ListInput.scss';
import TextField from "@mui/material/TextField";
import {DishDifficulty, MealType} from "../../../../enums.ts";
import AddIcon from '@mui/icons-material/Add';
import {IconButton} from "@mui/material";
import {useState} from "react";
import _ from 'lodash';
import Chip from '@mui/material/Chip';


type ListInputProps = {
    label: string;
    stateKey:string;
    description: string;
    handleChange: (key:string, value:string | number | boolean | string[] | DishDifficulty | MealType) => void;
    values: string[];
}
function ListInput({label, stateKey, description, handleChange, values}: ListInputProps) {
    const [value, setValue] = useState('');

    const handleSubmit = () => {
        handleChange(stateKey, values.concat(value));
    }

    const handleDelete = (index: number) => {
        let newValues = _.cloneDeep(values);
        newValues.splice(index, 1);
        handleChange(stateKey, newValues);
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
            <div className="list-input__list">
                {values && values.map((value, index) => (
                    <Chip key={index} label={value} onDelete={() => handleDelete(index)} />
                ))}
            </div>
        </div>
    );
}

export default ListInput;