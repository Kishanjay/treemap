import { useEffect } from "react"

import Maple from '../components/maple';

export default function() {
    // useEffect(() => {
    //     svgInit(document.querySelector("#map"));
    // }, []);
    return (<Maple />)
}


function svgInit(elem: HTMLElement) { 
    const div = document.createElement("div");
    div.innerHTML = "Test";

    elem.appendChild(div);
}