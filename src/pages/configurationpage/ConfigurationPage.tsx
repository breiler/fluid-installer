import React, { useState } from "react";
import Configuration, {
    ConfigurationTab
} from "../../panels/configuration/Configuration";
import ConfigurationTabs from "../../panels/configuration/ConfigurationTabs";

type ConfigurationProps = {};

const ConfigurationPage = ({}: ConfigurationProps) => {
    const [tab, setTab] = useState<ConfigurationTab>(ConfigurationTab.GENERAL);
    const [hasErrors, setHasErrors] = useState<boolean>(false);

    return (
        <>
            <ConfigurationTabs
                onChange={setTab}
                currentTab={tab}
                hasErrors={hasErrors}
            />
            <br />
            <Configuration
                currentTab={tab}
                onClose={() => {}}
                value=""
                onChange={(value, errors) => {}}
            />
        </>
    );
};

export default ConfigurationPage;
