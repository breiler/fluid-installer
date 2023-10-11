import React from "react";
import { FirmwareChoice } from "../../services";
import FirmwareBreadcrumb from "./FirmwareBreadcrumb";

type FirmwareBreadCrumbListProps = {
    selectedChoices: FirmwareChoice[];
    setSelectedChoices: React.Dispatch<React.SetStateAction<FirmwareChoice[]>>;
};

const FirmwareBreadCrumbList = ({
    selectedChoices,
    setSelectedChoices
}: FirmwareBreadCrumbListProps) => {
    return selectedChoices.length > 1 ? (
        <>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    {selectedChoices.map((choice) => (
                        <FirmwareBreadcrumb
                            key={choice.name}
                            choice={choice}
                            onClick={(choice) =>
                                setSelectedChoices((choices) => [
                                    ...choices.splice(
                                        0,
                                        choices.indexOf(choice) + 1
                                    )
                                ])
                            }
                        />
                    ))}
                </ol>
            </nav>
            <hr />
        </>
    ) : (
        <></>
    );
};

export default FirmwareBreadCrumbList;
