import React, { ReactElement } from "react";

type Props = {
    children?: ReactElement | ReactElement[];
    header?: ReactElement | ReactElement[];
    footer?: ReactElement | ReactElement[];
    className?: string;
};

const Card = ({ children, header, footer, className }: Props) => {
    return (
        <div className={className + " card"}>
            {header && <div className="card-header">{header}</div>}
            <div className="card-body">{children}</div>
            {footer && <div className="card-footer">{footer}</div>}
        </div>
    );
};

export default Card;
