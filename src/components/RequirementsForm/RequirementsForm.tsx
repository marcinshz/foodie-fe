import {DishDifficulty, MealType, RequirementTypes} from "../../enums.ts";
import './RequirementsForm.scss';
import RequirementsFormStep from "./RequirementsFormStep/RequirementsFormStep.tsx";
import Button from "@mui/material/Button";
import React, {useState} from "react";
import {Step, StepLabel, Stepper} from "@mui/material";
import {MealPlanRequirementsSteps, SingleDishRequirementsSteps} from "../../constants.ts";
import {getRequirementsFormState} from "./RequirementsFormStep/formStepTemplates.ts";
import {MealPlanResultType, SingleDishResultType} from "../../types.ts";
import {DotLottieReact} from '@lottiefiles/dotlottie-react';
import {generateMealPlan, generateSingleDishDefault} from "../../DataService.ts";

type RequirementsFormProps = {
    type: RequirementTypes;
    setSingleDishResult?: React.Dispatch<React.SetStateAction<SingleDishResultType | undefined>>;
    setMealPlanResult?: React.Dispatch<React.SetStateAction<MealPlanResultType | undefined>>;
}

function RequirementsForm({type, setSingleDishResult, setMealPlanResult}: RequirementsFormProps) {
    const [step, setStep] = useState(0);
    const [formState, setFormState] = useState(getRequirementsFormState(type));
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        // TODO: Add error handling
        if (formState) {
            setLoading(true);

            switch (type) {
                case RequirementTypes.SingleDish:
                    const singleDishData = await generateSingleDishDefault(formState);
                    if (singleDishData && setSingleDishResult) {
                        setLoading(false);
                        setSingleDishResult(singleDishData);
                    }
                    break;
                case RequirementTypes.MealPlan:
                    const mealPlanData = await generateMealPlan(formState);
                    if (mealPlanData && setMealPlanResult) {
                        setLoading(false);
                        setMealPlanResult(mealPlanData);
                    }
                    break;
            }
        }
    }

    const handleChange = (key: string, value: string | number | boolean | string[] | DishDifficulty | MealType) => {
        setFormState((prevState) => {
            return {...prevState, [key]: value}
        })
    }

    const isLastStep = (type === RequirementTypes.SingleDish && step === 3) || 
                       (type === RequirementTypes.MealPlan && step === 4);

    return (
        <div className="requirements-form">
            {loading ? (
                <div className="requirements-form__loading">
                    <div className="requirements-form__loading__content">
                        <DotLottieReact
                            src="https://lottie.host/534b0f0b-129c-431c-9409-0c01f483a65e/mH9DH2WwNI.lottie"
                            loop
                            autoplay
                        />
                        <h3>Cooking up your {type === RequirementTypes.SingleDish ? 'recipe' : 'meal plan'}...</h3>
                        <p>This might take a moment</p>
                    </div>
                </div>
            ) : (
                <>
                    <div className="requirements-form__header">
                        <div className="requirements-form__header__badge">
                            {type === RequirementTypes.SingleDish ? 'Single Dish' : 'Meal Plan'}
                        </div>
                        <h1>Let's personalize your {type === RequirementTypes.SingleDish ? 'recipe' : 'meal plan'}</h1>
                        <p>Answer a few questions to help us create something perfect for you. All fields are optional!</p>
                    </div>

                    <div className="requirements-form__stepper-container">
                        <Stepper 
                            activeStep={step} 
                            alternativeLabel
                            sx={{
                                '.MuiStepLabel-label': {
                                    marginTop: '8px',
                                    fontSize: '0.95rem',
                                    fontWeight: 500
                                },
                                '.MuiStepLabel-label.Mui-active': {
                                    color: '#757bc8',
                                    fontWeight: 600
                                },
                                '.MuiStepLabel-label.Mui-completed': {
                                    color: '#757bc8',
                                    fontWeight: 600
                                },
                                '.MuiStepIcon-root': {
                                    fontSize: '2rem'
                                },
                                '.MuiStepIcon-root.Mui-active': {
                                    color: '#757bc8'
                                },
                                '.MuiStepIcon-root.Mui-completed': {
                                    color: '#757bc8'
                                }
                            }}
                        >
                            {type === RequirementTypes.SingleDish && SingleDishRequirementsSteps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                            {type === RequirementTypes.MealPlan && MealPlanRequirementsSteps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </div>

                    <div className="requirements-form__content">
                        <RequirementsFormStep type={type} step={step} formState={formState} handleChange={handleChange}/>
                    </div>

                    <div className="requirements-form__navigation">
                        <Button 
                            variant="outlined" 
                            color="primary" 
                            disabled={step === 0}
                            onClick={() => setStep(step - 1)}
                            size="large"
                            sx={{ minWidth: '120px' }}
                        >
                            Back
                        </Button>
                        <div className="requirements-form__navigation__progress">
                            Step {step + 1} of {type === RequirementTypes.SingleDish ? 4 : 5}
                        </div>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={isLastStep ? handleSubmit : () => setStep(step + 1)}
                            size="large"
                            sx={{ 
                                minWidth: '120px',
                                background: isLastStep ? 'linear-gradient(90deg, #757bc8 0%, #9fa3d4 100%)' : undefined
                            }}
                        >
                            {isLastStep ? 'Generate!' : 'Next'}
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}

export default RequirementsForm;