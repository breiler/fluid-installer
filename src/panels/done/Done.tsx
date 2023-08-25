import React, { MouseEventHandler } from "react";
import { Button, Spinner } from "../../components";
import PageTitle from "../../components/pagetitle/PageTitle";

type Props = {
    onContinue: MouseEventHandler;
};
const Done = ({ onContinue }: Props) => {
    return (
        <>
            <PageTitle>Done</PageTitle>
            <p>
                The controller has been successfully installed and is ready to
                be used.
            </p>
            <Button onClick={onContinue}>
                <>Continue</>
            </Button>
        </>
    );
};

export default Done;
