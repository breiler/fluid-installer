import React from "react";
import "./Ribbon.scss";
import { ReactElement } from "react-markdown/lib/react-markdown";

type Props = { children: ReactElement; variant: string };

const Ribbon = ({ children, variant = "danger" }: Props) => {
    return (
        <div className={"ribbon ribbon-top-right " + variant}>
            <span>{children}</span>
        </div>
    );
};

export default Ribbon;
