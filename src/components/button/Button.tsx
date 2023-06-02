import React from "react";
import { MouseEventHandler } from "react";
import { ReactElement } from "react";
import Spinner from "../spinner";
import "./Button.css";

export const ButtonType = {
    PRIMARY: "btn-primary",
    DANGER: "btn-danger"
};

type Props = {
    title?: string;
    loading?: boolean;
    disabled?: boolean;
    onClick?: MouseEventHandler;
    children?: ReactElement | ReactElement[];
    buttonType?: any;
    style?: any;
};

const Button = ({
    title,
    loading,
    disabled,
    onClick,
    children,
    buttonType = ButtonType.PRIMARY,
    style
}: Props) => {
    return (
        <button
            title={title}
            style={style}
            className={
                "component-button btn " +
                buttonType +
                " btn-md btn-block position-relative"
            }
            type="button"
            onClick={onClick}
            disabled={disabled}>
            <>
                {loading && <Spinner />}
                {children}
            </>
        </button>
    );
};

export default Button;
