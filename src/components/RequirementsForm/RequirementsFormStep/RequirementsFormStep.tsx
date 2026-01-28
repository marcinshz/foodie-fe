import './RequirementsFormStep.scss';
import {DishDifficulty, MealType, RequirementTypes} from "../../../enums.ts";
import {MealPlanRequirementsStepsInputs, SingleDishRequirementsStepsInputs} from "./formStepTemplates.ts";
import InputWrapper from "./InputWrapper/InputWrapper.tsx";

type RequirementsFormProps = {
    type: RequirementTypes;
    step: number;
    formState: any;
    handleChange: (key: string, value: string | number | boolean | string[] | DishDifficulty | MealType) => void
}

function RequirementsFormStep({type, step, formState, handleChange}: RequirementsFormProps) {
    return (
        <div className="requirements-form-step">
            {type === RequirementTypes.SingleDish &&
                <>
                    {SingleDishRequirementsStepsInputs[step].map(({label, key, description, type}) => (
                        <InputWrapper
                            key={key}
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
            {type === RequirementTypes.MealPlan &&
                <>
                    {MealPlanRequirementsStepsInputs[step].map(({label, key, description, type}) => (
                        <InputWrapper
                            key={key}
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