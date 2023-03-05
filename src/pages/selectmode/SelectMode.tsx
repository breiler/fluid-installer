import React from "react";
import { Button, Card } from "../../components";
import Page from "../../model/Page";

type Props = {
    onSelect: (page: Page) => void;
};

const SelectMode = ({ onSelect }: Props) => {
    return (
        <div className="container text-center">
            <div className="row">
                <div className="col">
                    <Card
                        footer={
                            <Button onClick={() => onSelect(Page.INSTALLER)}>
                                <>Install FluidNC</>
                            </Button>
                        }>
                        <>Install or upgrade FluidNC on your controller</>
                    </Card>
                </div>
                <div className="col">
                    <Card
                        footer={
                            <Button onClick={() => onSelect(Page.TERMINAL)}>
                                <>Open terminal</>
                            </Button>
                        }>
                        <>Connect with your controller using a terminal</>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SelectMode;
