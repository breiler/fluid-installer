import React from "react";
import "./Ribbon.scss";
import { ReactElement } from "react-markdown/lib/react-markdown";

const Ribbon = ({children} : {children: ReactElement}) => {
    return (<div className="ribbon ribbon-top-right"><span>{children}</span></div>)
}

export default Ribbon;