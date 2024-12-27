import React from "react";
import { FirmwareChoice, GithubRelease } from "../../services";
import FirmwareBreadcrumb from "./FirmwareBreadcrumb";
import { Breadcrumb, BreadcrumbItem } from "react-bootstrap";

type FirmwareBreadCrumbListProps = {
    release: GithubRelease;
    selectedChoices: FirmwareChoice[];
    setSelectedChoices: React.Dispatch<React.SetStateAction<FirmwareChoice[]>>;
};

const FirmwareBreadCrumbList = ({
    release,
    selectedChoices,
    setSelectedChoices
}: FirmwareBreadCrumbListProps) => {
    return selectedChoices.length > 0 ? (
        <>
            <Breadcrumb>
                <BreadcrumbItem active={true}>{release.name}</BreadcrumbItem>
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
            </Breadcrumb>
        </>
    ) : (
        <></>
    );
};

export default FirmwareBreadCrumbList;
