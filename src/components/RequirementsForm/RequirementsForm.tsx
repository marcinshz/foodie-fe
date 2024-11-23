import {DishDifficulty, MealType, RequirementTypes} from "../../enums.ts";
import './RequirementsForm.scss';
import {Link} from "react-router-dom";
import Plate from "../iconComponents/plate.tsx";
import RequirementsFormStep from "./RequirementsFormStep/RequirementsFormStep.tsx";
import Button from "@mui/material/Button";
import {useEffect, useState} from "react";
import {Step, StepLabel, Stepper} from "@mui/material";
import {SingleDishRequirementsSteps} from "../../constants.ts";
import {getRequirementsFormState} from "./RequirementsFormStep/formStepTemplates.ts";

type RequirementsFormProps = {
    type: RequirementTypes
}

function RequirementsForm({type}: RequirementsFormProps) {
    const [step, setStep] = useState(0);
    const [formState, setFormState] = useState(getRequirementsFormState(type));
    const handleSubmit = () => {}

    const handleChange = (key:string, value:string | number | boolean | string[] | DishDifficulty | MealType) => {
        setFormState((prevState) => {
            return {...prevState, [key]: value}
        })
    }

    useEffect(() => {
        console.log('formState', formState)
    }, [formState]);

    return (
        <div className="requirements-form">
            <div className="requirements-form__header">
                <div className="requirements-form__header__text">
                    <h2>First of all, we need to ask you a few questions.</h2>
                    <p>Please answer following questions to help us provide you with recipes tailored to your preferences. Answers are optional, but help us understand your taste and preferences.</p>
                </div>
                <div className="requirements-form__header__invite-to-inspiration">
                    <p>Wanna skip questions? Click on the plate and try our inspo feature!</p>
                    <Link to={'/authorized/inspiration'}>
                        <div className="requirements-form__header__invite-to-inspiration__plate">
                            <Plate/>
                        </div>
                    </Link>
                </div>
            </div>
            <Stepper activeStep={step} alternativeLabel>
                {SingleDishRequirementsSteps.map((label) => (
                    <Step key={label} sx={{'.Mui-active, .Mui-completed': {color: '#757bc8'}}}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <RequirementsFormStep type={type} step={step} formState={formState} handleChange={handleChange}/>
            <div className="requirements-form__navigation">
                <Button variant="filled" color="primary" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</Button>
                {step !== 3 ?
                    <Button variant="filled" color="primary" onClick={() => setStep(step + 1)}>Next</Button>
                :
                    <Button variant="filled" color="primary" onClick={handleSubmit}>Submit</Button>
                }
            </div>
        </div>
    );
}

export default RequirementsForm;