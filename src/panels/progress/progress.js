import { useContext } from "react";
import { AppContext } from "../../app";

const Progress = ({ progress }) => {
  const { currentFile, count, fileName, sent } = progress;

  const max = count * 100;
  const current = currentFile * 100 + sent;
  const percentage = Math.round((current / max) * 100);

  return (
    <div className="card">
      <div className="card-body">
        <h2>Installing</h2>
        <div className="progress" style={{ height: "30px" }}>
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: percentage + "%" }}
          >
            {percentage + "%"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
