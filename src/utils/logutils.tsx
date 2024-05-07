import React from "react";

export const createLogLine = (line: string) => {
    line.replace("<", "&lt;");
    line = line.replace(/MSG:ERR/g, "<span class='red'>$&</span>");
    line = line.replace(/MSG:INFO/g, "<span class='green'>$&</span>");
    line = line.replace(/MSG:WARN/g, "<span class='yellow'>$&</span>");
    line = line.replace(/MSG:DBG/g, "<span class='yellow'>$&</span>");
    line = line.replace(/&lt;Alarm/g, "&lt;<span class='red'>Alarm</span>");
    line = line.replace(/&lt;Run/g, "&lt;<span class='green'>Run</span>");
    line = line.replace(/&lt;Idle/g, "&lt;<span class='green'>Idle</span>");
    line = line.replace(/error:/g, "<span class='red'>error:</span>");
    return <div dangerouslySetInnerHTML={{ __html: line }} />;
};
