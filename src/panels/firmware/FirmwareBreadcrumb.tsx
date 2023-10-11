import React from "react";
import { FirmwareChoice } from "../../services";

type FirmwareChoiceProps = {
    choice: FirmwareChoice;
    onClick(choice: FirmwareChoice);
};

const FirmwareBreadcrumb = ({ choice, onClick }: FirmwareChoiceProps) => {
    return (
        <li className="breadcrumb-item" key={choice.name}>
            <a href="#" onClick={() => onClick(choice)}>
                {choice.name}
            </a>
        </li>
    );
};

export default FirmwareBreadcrumb;
