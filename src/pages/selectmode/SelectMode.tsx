import React from "react";
import Page from "../../model/Page";
import { InstallCard } from "../../components/installcard/InstallCard";
import "./SelectMode.scss";
import { TerminalCard } from "../../components/terminalcard/TerminalCard";
import { FileBrowserCard } from "../../components/filebrowsercard/FileBrowserCard";

type Props = {
    onSelect: (page: Page) => void;
};

const SelectMode = ({ onSelect }: Props) => {
    return (
        <div className="container text-center">
            <div className="row">
                <div className="col">
                    <InstallCard onClick={() => onSelect(Page.INSTALLER)} />
                </div>
                <div className="col">
                    <TerminalCard onClick={() => onSelect(Page.TERMINAL)} />
                </div>
                <div className="col">
                    <FileBrowserCard
                        onClick={() => onSelect(Page.FILEBROWSER)}
                    />
                </div>
            </div>
        </div>
    );
};

export default SelectMode;
