import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
  className: string;
  text: string;
  disabled?: boolean;
}

export default function SubmitButton({ className, text, disabled }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className={className}
    >
      {pending ? 'Loading...' : text}
    </button>
  );
}