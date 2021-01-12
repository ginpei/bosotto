import { HTMLProps } from "react";
import "./InputField.scss";

export const InputField: React.FC<
  HTMLProps<HTMLInputElement> & { label: string }
> = ({ label, ...props }) => {
  return (
    <label className="InputField">
      <span className="InputField-labelText">{label}</span>
      <input {...props} />
    </label>
  );
};
