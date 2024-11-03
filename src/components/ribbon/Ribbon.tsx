import React, { ReactNode } from "react";
import "./Ribbon.scss";

type Props = { children: ReactNode; variant?: string };

const Ribbon = ({ children, variant = "danger" }: Props) => {
    return (
        <div className={"ribbon ribbon-top-right " + variant}>
            <span>{children}</span>
        </div>
    );
};

export default Ribbon;
