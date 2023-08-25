import React, { ReactNode } from "react";
import "./PageTitle.scss";

const PageTitle = ({children} : {children: ReactNode}) => {
    return (<><h1 className="page-title">{children}</h1></>)
}

export default PageTitle;