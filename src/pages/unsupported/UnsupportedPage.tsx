import React from "react";
import { Header } from "../../components";
import Unsupported from "../../panels/unsupported/Unsupported";

const UnsupportedPage = () => {
    return (
        <>
            <Header />
            <div className="container">
                <Unsupported />
            </div>
        </>
    );
};

export default UnsupportedPage;
