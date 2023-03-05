import React from "react";
import { MouseEventHandler } from "react";
import { ReactElement } from "react";
import Spinner from "../spinner";
import "./Button.css";

export const ButtonType = {
    PRIMARY: "btn-primary",
    DANGER: "btn-danger",
};

type Props = {
    loading?: boolean;
    disabled?: boolean;
    onClick?: MouseEventHandler;
    children?: ReactElement | ReactElement[];
    buttonType?: any;
    style?: any;
};

const Button = ({
    loading,
    disabled,
    onClick,
    children,
    buttonType = ButtonType.PRIMARY,
    style,
}: Props) => {
    return (
        <button
            style={style}
            className={"component-button btn " + buttonType + " btn-md"}
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
