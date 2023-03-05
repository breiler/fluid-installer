import React, { MouseEventHandler } from "react";
import { Button, Spinner } from "../../components";

type Props = {
    onContinue: MouseEventHandler;
};
const Done = ({ onContinue }: Props) => {
    return (
        <>
            <h2>Done</h2>
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
