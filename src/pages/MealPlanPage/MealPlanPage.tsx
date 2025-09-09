import {useLoaderData} from "react-router-dom";
import {useEffect, useState} from "react";
import RequirementsForm from "../../components/RequirementsForm/RequirementsForm.tsx";
import {RequirementTypes} from "../../enums.ts";
import {MealPlanResultType} from "../../types.ts";

enum MealPlanPageSteps {
    Requirements = 0,
    Result = 1,
}

function MealPlanPage() {
    const existingPlan = useLoaderData();
    const [step, setStep] = useState<MealPlanPageSteps>(MealPlanPageSteps.Requirements);
    const [result, setResult] = useState<MealPlanResultType | undefined>(existingPlan as MealPlanResultType | undefined);

    useEffect(() => {
        if (result) setStep(MealPlanPageSteps.Result);
    }, [result]);

    return (
        <div className="meal-plan-page container">
            {step === MealPlanPageSteps.Requirements && <RequirementsForm type={RequirementTypes.MealPlan}
                                                                          setResult={setResult}/>}
            {step === MealPlanPageSteps.Result && result && <></>}
        </div>
    );
}

export default MealPlanPage;