import {DishDifficulty, MealType, RequirementsFormInputTypes} from "../../../../enums.ts";
import ListInput from "../ListInput/ListInput.tsx";
import {useEffect} from "react";
import TextInput from "../TextInput/TextInput.tsx";
import CheckboxInput from "../CheckboxInput/CheckboxInput.tsx";
import NumberInput from "../NumberInput/NumberInput.tsx";
import SelectInput from "../SelectInput/SelectInput.tsx";

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
            {type === RequirementsFormInputTypes.Text &&
                <TextInput
                    label={label}
                    stateKey={stateKey}
                    description={description}
                    handleChange={handleChange}
                    value={value as string}
                />
            }
            {type === RequirementsFormInputTypes.Boolean &&
                <CheckboxInput
                    stateKey={stateKey}
                    label={label}
                    description={description}
                    handleChange={handleChange}
                    value={value as boolean}
                />
            }
            {type === RequirementsFormInputTypes.Number &&
                <NumberInput
                    stateKey={stateKey}
                    label={label}
                    description={description}
                    handleChange={handleChange}
                    value={value as number}
                />
            }
            {type === RequirementsFormInputTypes.Select &&
                <SelectInput
                    stateKey={stateKey}
                    label={label}
                    description={description}
                    handleChange={handleChange}
                    value={value as DishDifficulty | MealType}
                />
            }
        </>
    );
}

export default InputWrapper;