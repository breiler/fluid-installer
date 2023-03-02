import { Card, Spinner } from "../../components";
import ProgressBar from "../../components/progressbar/progressbar";
import Status from "../../model/status";

const Progress = ({ progress, status }) => {
  const { fileIndex, fileCount, fileName, fileProgress } = progress;

  return (
    <>
      <h2>Installing</h2>
      <p>
        {status === Status.DOWNLOADING && (
          <>
            Downloading package... <Spinner />
          </>
        )}
        {status === Status.EXTRACTING && (
          <>
            Extracting package... <Spinner />
          </>
        )}
        {status === Status.FLASHING && <>Installing package to device...  <Spinner /></>}
      </p>

      <ProgressBar
        maxValue={fileCount * 100}
        currentValue={fileIndex * 100 + fileProgress}
      />
    </>
  );
};

export default Progress;
