import React from "react";
import { ReactNode } from "react";
import { Card } from "react-bootstrap";

type Props = {
    show: boolean;
    children: ReactNode;
};

const CollapseSection = ({ show, children }: Props) => {
    return (
        show && (
            <Card style={{ padding: "16px", backgroundColor: "#eee" }}>
                {children}
            </Card>
        )
    );
};

export default CollapseSection;
