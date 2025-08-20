"use client";
import { useState } from "react"
import Loader from "./Loader"
import SubAtLoadLoadShow from "./subcomponents/SubAtLoadLoadShow"

function AtLoadModalShow() 
{

    const [loader, setLoader] = useState(false)
    return (
        <SubAtLoadLoadShow setLoader={setLoader} />
    )
}

export default AtLoadModalShow