import './SingleDishResult.scss'
import {SingleDishResultType} from "../../../types.ts";

type SingleDishResultProps = {
    result: SingleDishResultType;
}

function SingleDishResult({result}: SingleDishResultProps) {
    return (
        <div>{JSON.stringify(result)}</div>
    );
}

export default SingleDishResult;