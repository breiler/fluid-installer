import React from "react";

type Props = {
    maxValue: number;
    currentValue: number;
};

const ProgressBar = ({ maxValue, currentValue }: Props) => {
    const percentage = Math.round((currentValue / maxValue) * 100);

    return (
        <div className="progress" style={{ height: "30px" }}>
            <div
                className="progress-bar"
                role="progressbar"
                style={{ width: percentage + "%" }}
            >
                {percentage + "%"}
            </div>
        </div>
    );
};

export default ProgressBar;
