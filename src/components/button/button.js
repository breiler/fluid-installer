import Spinner from "../spinner";
import * as classes from "./button.module.css";

export const ButtonType = {
  PRIMARY: "btn-primary",
  DANGER: "btn-danger",
};

const Button = ({
  loading,
  disabled,
  onClick,
  children,
  buttonType = ButtonType.PRIMARY,
  style,
}) => {
  return (
    <button
      style={style}
      className={"btn " + buttonType + " btn-md " + classes.button}
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      <>
        {loading && <Spinner />}
        {children}
      </>
    </button>
  );
};

export default Button;
