import './SingleDishPage.scss'
import {useEffect, useState} from 'react'
import RequirementsForm from "../../components/RequirementsForm/RequirementsForm.tsx";
import {RequirementTypes} from "../../enums.ts";
import {SingleDishResultType} from "../../types.ts";
import SingleDishResult from "./SingleDishResult/SingleDishResult.tsx";

enum SingleDishPageSteps {
    Requirements = 0,
    Result = 1,
}

function SingleDishPage() {
    const [step, setStep] = useState<SingleDishPageSteps>(SingleDishPageSteps.Requirements);
    const [result, setResult] = useState<SingleDishResultType | undefined>();

    useEffect(() => {
        if (result) setStep(SingleDishPageSteps.Result);
    }, [result]);

    return (
        <div className="single-dish-page container">
            {step === SingleDishPageSteps.Requirements && <RequirementsForm type={RequirementTypes.SingleDish}
                                                                            setResult={setResult}/>}
            {step === SingleDishPageSteps.Result && result && <SingleDishResult result={result}/>}
        </div>
    );
}

export default SingleDishPage;