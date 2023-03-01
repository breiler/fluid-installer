import ProgressBar from "../../components/progressbar/progressbar";

const Progress = ({ progress }) => {
  const { fileIndex, fileCount, fileName, fileProgress } = progress;

  return (
    <div className="card">
      <div className="card-body">
        <h2>Installing</h2>
        <ProgressBar maxValue={fileCount * 100} currentValue={fileIndex * 100 + fileProgress}/>
      </div>
    </div>
  );
};

export default Progress;
