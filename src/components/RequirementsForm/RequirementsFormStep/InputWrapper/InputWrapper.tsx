import {DishDifficulty, MealType, RequirementsFormInputTypes} from "../../../../enums.ts";
import ListInput from "../ListInput/ListInput.tsx";
import {useEffect} from "react";

type InputWrapperProps = {
    type: RequirementsFormInputTypes;
    stateKey:any;
    label: string;
    description: string;
    value: string | number | boolean | string[] | DishDifficulty | MealType;
    handleChange: (key:string, value:string | number | boolean | string[] | DishDifficulty | MealType) => void
}
function InputWrapper({type,stateKey, label,description, value, handleChange}: InputWrapperProps) {
    return (
        <>
            {type === RequirementsFormInputTypes.List &&
                <ListInput
                    label={label}
                    stateKey={stateKey}
                    description={description}
                    handleChange={handleChange}
                    values={value as string[]}
                />
            }
            {type === RequirementsFormInputTypes.Text && <></> }
            {type === RequirementsFormInputTypes.Select && <></> }
            {type === RequirementsFormInputTypes.Boolean && <></> }
        </>
    );
}

export default InputWrapper;