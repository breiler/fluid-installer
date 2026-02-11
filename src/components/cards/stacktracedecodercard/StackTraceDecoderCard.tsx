import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../button";
import Card from "../card";
import { faBug } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { CapturedBacktraceContext } from "../../../context/CapturedBacktraceContext";

type StackTraceDecoderCardProps = {
    onClick: () => void;
};

export const StackTraceDecoderCard = ({
    onClick
}: StackTraceDecoderCardProps) => {
    const { t } = useTranslation();
    const backtraceContext = useContext(CapturedBacktraceContext);

    return (
        <Card
            className="select-card"
            style={
                backtraceContext?.backtraceLine
                    ? {
                          backgroundColor: "var(--bs-success-bg-subtle)",
                          borderColor: "var(--bs-success)",
                          borderWidth: "2px",
                          transition: "all 0.2s"
                      }
                    : undefined
            }
            footer={
                <Button onClick={onClick}>{t("card.stacktrace.open")}</Button>
            }
        >
            <div
                className="select-icon"
                style={
                    backtraceContext?.backtraceLine
                        ? {
                              color: "var(--bs-success)"
                          }
                        : undefined
                }
            >
                <FontAwesomeIcon icon={faBug as IconDefinition} size="4x" />
            </div>
            <>{t("card.stacktrace.description")}</>
        </Card>
    );
};
