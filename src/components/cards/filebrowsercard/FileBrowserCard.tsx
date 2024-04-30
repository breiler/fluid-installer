import React from "react";
import Card from "../card";
import Button from "../../button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type FileBrowserCardProps = {
    disabled?: boolean;
    onClick: () => void;
};

export const FileBrowserCard = ({
    onClick,
    disabled = false
}: FileBrowserCardProps) => {
    return (
        <Card
            className="select-card"
            footer={
                <Button onClick={onClick} disabled={disabled}>
                    <>File browser</>
                </Button>
            }
        >
            <div className="select-icon">
                <FontAwesomeIcon
                    icon={faFolderOpen as IconDefinition}
                    size="4x"
                />
            </div>
            <>Manage files on the controller</>
        </Card>
    );
};
