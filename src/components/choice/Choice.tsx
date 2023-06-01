import React from "react";
import {
    FirmwareChoice,
} from "../../services/GitHubService";
import Button from "../button";
import Ribbon from "../ribbon/Ribbon";

type ChoiceProps = {
    choice: FirmwareChoice;
    onSelect: (choice: FirmwareChoice) => void;
};

const Choice = ({ choice, onSelect }: ChoiceProps) => {
    return (
        <>
            <h2>{choice["choice-name"]}</h2>
            <div className="d-grid gap-2">
                {choice.choices.map((subChoice) => (
                    <Button
                        style={{ minHeight: "60px" }}
                        key={subChoice.name}
                        onClick={() => onSelect(subChoice)}>
                        <>
                            <h3>{subChoice.name}</h3>

                            {subChoice.description}
                            {subChoice.erase && (
                                <>
                                    <br />
                                    <span className="badge text-bg-danger">
                                        This will erase all files and configurations!
                                    </span>
                                    <Ribbon>CAUTION!</Ribbon>
                                </>
                            )}
                        </>
                    </Button>
                ))}
            </div>
        </>
    );
};

export default Choice;
