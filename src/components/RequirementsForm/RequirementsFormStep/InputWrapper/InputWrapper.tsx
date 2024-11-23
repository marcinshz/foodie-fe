import {DishDifficulty, MealType, RequirementsFormInputTypes} from "../../../../enums.ts";
import ListInput from "../ListInput/ListInput.tsx";

type InputWrapperProps = {
    type: RequirementsFormInputTypes;
    label: string;
    description: string;
    value: string | number | boolean | string[] | DishDifficulty | MealType;
    key: string;
    handleChange: (key:string, value:string | number | boolean | string[] | DishDifficulty | MealType) => void
}
function InputWrapper({type,label,description, key, value, handleChange}: InputWrapperProps) {
    return (
        <>
            {type === RequirementsFormInputTypes.List &&
                <ListInput
                    label={label}
                    key={key}
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