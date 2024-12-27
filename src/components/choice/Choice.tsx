import React from "react";
import { FirmwareChoice } from "../../services/GitHubService";
import Button from "../button";
import Ribbon from "../ribbon/Ribbon";

type ChoiceProps = {
    choice: FirmwareChoice;
    onSelect: (choice: FirmwareChoice) => void;
};

const Choice = ({ choice, onSelect }: ChoiceProps) => {
    return (
        <>
            <h3>{choice["choice-name"]}</h3>
            <div className="d-grid gap-3">
                {choice.choices.map((subChoice) => (
                    <Button
                        style={{ minHeight: "60px", marginRight: 0 }}
                        key={subChoice.name}
                        onClick={() => onSelect(subChoice)}
                    >
                        <>
                            <h2>{subChoice.name}</h2>

                            {subChoice.description}
                            {subChoice.erase && (
                                <>
                                    <br />
                                    <span className="badge text-bg-danger">
                                        This will erase all files and
                                        configurations!
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
