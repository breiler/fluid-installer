import * as classes from "./spinner.module.css";
const Spinner = () => {
  return (
    <span
      className={"spinner-border spinner-border-sm " + classes.spinner}
      role="status"
      aria-hidden="true"
    />
  );
};

export default Spinner;
