import React, { useCallback } from "react";

export const Input: React.FC<{
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  disabled?: boolean;
}> = ({ text, setText, disabled }) => {
  const onChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      setText(e.currentTarget.value);
    },
    [setText],
  );

  return (
    <div>
      <label 
        htmlFor="clientName"
        style={{
          display: "block",
          marginBottom: "0.5rem",
          fontSize: "1rem",
          fontWeight: 600,
          color: "#ffffff"
        }}
      >
        Client Name
      </label>
      <input
        id="clientName"
        className="leading-[1.7] block w-full rounded-geist bg-background p-geist-half text-foreground text-sm border border-unfocused-border-color transition-colors duration-150 ease-in-out focus:border-focused-border-color outline-none"
        disabled={disabled}
        name="clientName"
        value={text}
        onChange={onChange}
        placeholder="Enter your client's company name..."
        style={{
          fontSize: "1.1rem",
          padding: "1rem",
          background: "rgba(30, 41, 59, 0.8)",
          border: "2px solid rgba(99, 102, 241, 0.3)",
          borderRadius: "0.75rem",
          color: "#ffffff",
          transition: "all 0.3s ease"
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#6366f1";
          e.target.style.boxShadow = "0 0 0 3px rgba(99, 102, 241, 0.1)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "rgba(99, 102, 241, 0.3)";
          e.target.style.boxShadow = "none";
        }}
      />
    </div>
  );
};
