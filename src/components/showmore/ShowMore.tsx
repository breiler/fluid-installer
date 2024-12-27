import React, { ReactNode, useState } from "react";
import { Button } from "react-bootstrap";
import "./ShowMore.scss";

type Props = {
    children: ReactNode;
    maxHeight?: number;
};
const ShowMore = ({ children, maxHeight }: Props) => {
    const [showMore, setShowMore] = useState<boolean>(false);

    return (
        <div className="showMore">
            <span
                className={showMore ? "" : "shortBody"}
                style={showMore ? {} : { maxHeight: maxHeight ?? 400 }}
            >
                {children}
            </span>
            <Button
                variant="link"
                onClick={() => setShowMore((value) => !value)}
            >
                {showMore ? "Show less" : "Show more"}
            </Button>
        </div>
    );
};

export default ShowMore;
