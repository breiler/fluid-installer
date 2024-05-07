import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode, useEffect, useRef } from "react";
import "./Log.scss";

type LogProps = {
    show: boolean;
    onShow: (show: boolean) => void;
    children: ReactNode;
};

const Log = ({ show = false, onShow, children }: LogProps) => {
    const bottom = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottom?.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [bottom, children, show]);

    return (
        <div className="log-container">
            {show && (
                <div className="log">
                    {children}
                    <div ref={bottom} />
                </div>
            )}

            {show && (
                <a href="#" onClick={() => onShow(false)}>
                    Hide details{" "}
                    <FontAwesomeIcon icon={faChevronUp as IconDefinition} />
                </a>
            )}

            {!show && (
                <a href="#" onClick={() => onShow(true)}>
                    Show details{" "}
                    <FontAwesomeIcon icon={faChevronDown as IconDefinition} />
                </a>
            )}
        </div>
    );
};

export default Log;
