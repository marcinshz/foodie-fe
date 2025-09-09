import {DishDifficulty, MealType, RequirementTypes} from "../../enums.ts";
import './RequirementsForm.scss';
import {Link} from "react-router-dom";
import Plate from "../iconComponents/plate.tsx";
import RequirementsFormStep from "./RequirementsFormStep/RequirementsFormStep.tsx";
import Button from "@mui/material/Button";
import React, {useState} from "react";
import {Step, StepLabel, Stepper} from "@mui/material";
import {MealPlanRequirementsSteps, SingleDishRequirementsSteps} from "../../constants.ts";
import {getRequirementsFormState} from "./RequirementsFormStep/formStepTemplates.ts";
import {MealPlanResultType, SingleDishResultType} from "../../types.ts";
import {DotLottieReact} from '@lottiefiles/dotlottie-react';
import {generateSingleDishDefault} from "../../DataService.ts";

type RequirementsFormProps = {
    type: RequirementTypes;
    setResult: React.Dispatch<React.SetStateAction<SingleDishResultType | undefined>> | React.Dispatch<React.SetStateAction<MealPlanResultType | undefined>>
}

function RequirementsForm({type, setResult}: RequirementsFormProps) {
    const [step, setStep] = useState(0);
    const [formState, setFormState] = useState(getRequirementsFormState(type));
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        // TODO: Add error handling
        if (formState) {
            setLoading(true);

            switch (type) {
                case RequirementTypes.SingleDish:
                    const data = await generateSingleDishDefault(formState);
                    if (data) {
                        setLoading(false);
                        setResult(data);
                    }
                    break;
                case RequirementTypes.MealPlan:
                    console.log(formState);
                    break;
            }
        }
    }

    const handleChange = (key: string, value: string | number | boolean | string[] | DishDifficulty | MealType) => {
        setFormState((prevState) => {
            return {...prevState, [key]: value}
        })
    }

    return (
        <div className="requirements-form">
            {loading ? <div className="requirements-form__loading">
                    <DotLottieReact
                        src="https://lottie.host/534b0f0b-129c-431c-9409-0c01f483a65e/mH9DH2WwNI.lottie"
                        loop
                        autoplay
                    />
                </div>
                :
                <>
                    <div className="requirements-form__header">
                        <div className="requirements-form__header__text">
                            <h2>First of all, we need to ask you a few questions.</h2>
                            <p>Please answer following questions to help us provide you with recipes tailored to your
                                preferences. Answers are optional, but help us understand your taste and
                                preferences.</p>
                        </div>
                        <div className="requirements-form__header__invite-to-inspiration">
                            <p>Wanna skip questions? Click on the plate and try our inspo feature!</p>
                            <Link to={'/home/inspiration'}>
                                <div className="requirements-form__header__invite-to-inspiration__plate">
                                    <Plate/>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <Stepper activeStep={step} alternativeLabel>
                        {type === RequirementTypes.SingleDish && SingleDishRequirementsSteps.map((label) => (
                            <Step key={label} sx={{'.Mui-active, .Mui-completed': {color: '#757bc8'}}}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                        {type === RequirementTypes.MealPlan && MealPlanRequirementsSteps.map((label) => (
                            <Step key={label} sx={{'.Mui-active, .Mui-completed': {color: '#757bc8'}}}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    <RequirementsFormStep type={type} step={step} formState={formState} handleChange={handleChange}/>
                    <div className="requirements-form__navigation">
                        <Button variant="text" color="primary" disabled={step === 0}
                                onClick={() => setStep(step - 1)}>Back</Button>
                        {type === RequirementTypes.SingleDish ? step !== 3 ?
                                <Button variant="text" color="primary" onClick={() => setStep(step + 1)}>Next</Button>
                                :
                                <Button variant="text" color="primary" onClick={handleSubmit}>Submit</Button>
                            :
                            step !== 4 ?
                                <Button variant="text" color="primary" onClick={() => setStep(step + 1)}>Next</Button>
                                :
                                <Button variant="text" color="primary" onClick={handleSubmit}>Submit</Button>
                        }
                    </div>
                </>
            }
        </div>
    );
}

export default RequirementsForm;