const Card = ({ children, header, footer, className }) => {
  return (
    <div className={className + " card"}>
      {header && <div className="card-header">{header}</div>}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
};

export default Card;
