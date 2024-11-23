import './RequirementsFormStep.scss';
import {DishDifficulty, MealType, RequirementTypes} from "../../../enums.ts";
import {SingleDishRequirementsStepsInputs} from "./formStepTemplates.ts";
import InputWrapper from "./InputWrapper/InputWrapper.tsx";

type RequirementsFormProps = {
    type: RequirementTypes;
    step: number;
    formState: any;
    handleChange: (key:string, value:string | number | boolean | string[] | DishDifficulty | MealType) => void
}

function RequirementsFormStep({type,step, formState, handleChange}: RequirementsFormProps) {
    return (
        <div className="requirements-form-step">
            {type === RequirementTypes.SingleDish &&
                <>
                    {SingleDishRequirementsStepsInputs[step].map(({label,key, description,type}) => (
                        <InputWrapper
                            label={label}
                            stateKey={key}
                            description={description}
                            type={type}
                            value={formState[key]}
                            handleChange={handleChange}
                        />
                    ))}
                </>
            }
        </div>
    );
}

export default RequirementsFormStep;