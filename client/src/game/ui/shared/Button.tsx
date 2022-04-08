import "./Button.css";

const Button: React.FC<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
> = ({ children, className, ...props }) => {
  return (
    <button className="Button" {...props}>
      {children}
    </button>
  );
};

export default Button;
