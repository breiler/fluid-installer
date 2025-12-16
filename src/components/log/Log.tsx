import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode, useEffect, useRef } from "react";
import "./Log.scss";
import { useTranslation } from "react-i18next";

type LogProps = {
    show: boolean;
    showExpand?: boolean;
    onShow: (show: boolean) => void;
    children?: ReactNode;
};

const Log = ({ show = false, showExpand, onShow, children }: LogProps) => {
    const bottom = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();

    useEffect(() => {
        bottom?.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [bottom, children, show]);

    return (
        <div className="log-container">
            {show && (
                <div className="log">
                    <pre>
                        {children}
                        <div ref={bottom} />
                    </pre>
                </div>
            )}
            {(showExpand || showExpand === undefined) && (
                <>
                    {show && (
                        <a href="#" onClick={() => onShow(false)}>
                            {t("component.log.hide-details")}{" "}
                            <FontAwesomeIcon
                                icon={faChevronUp as IconDefinition}
                            />
                        </a>
                    )}

                    {!show && (
                        <a href="#" onClick={() => onShow(true)}>
                            {t("component.log.show-details")}{" "}
                            <FontAwesomeIcon
                                icon={faChevronDown as IconDefinition}
                            />
                        </a>
                    )}
                </>
            )}
        </div>
    );
};

export default Log;
