import React, { useState, useRef, useEffect } from "react";

interface OtpInputProps {
  length?: number;
  value?: string;
  onChange?: (otp: string) => void;
  onComplete?: (otp: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
}

export default function OtpInput({
  length = 6,
  value = "",
  onChange,
  onComplete,
  placeholder = "○",
  disabled = false,
  error = false,
}: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Sync with external value
  useEffect(() => {
    if (value !== otp.join("")) {
      setOtp(value.split("").concat(new Array(Math.max(0, length - value.length)).fill("")));
    }
  }, [value, length]);

  // Auto focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus();
    }
  }, [disabled]);

  const handleChange = (index: number, val: string) => {
    if (disabled) return;

    // Only allow single digit
    const sanitizedValue = val.replace(/[^0-9]/g, "");
    if (sanitizedValue.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = sanitizedValue;
    setOtp(newOtp);

    const otpString = newOtp.join("");
    onChange?.(otpString);

    // Move to next input if digit entered
    if (sanitizedValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if OTP is complete
    if (otpString.length === length && !otpString.includes("")) {
      onComplete?.(otpString);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (disabled) return;

    // Handle backspace
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];
      
      if (otp[index]) {
        // Clear current input
        newOtp[index] = "";
        setOtp(newOtp);
        onChange?.(newOtp.join(""));
      } else if (index > 0) {
        // Move to previous input and clear it
        newOtp[index - 1] = "";
        setOtp(newOtp);
        onChange?.(newOtp.join(""));
        inputRefs.current[index - 1]?.focus();
      }
    }
    
    // Handle arrow keys
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const sanitizedData = pastedData.replace(/[^0-9]/g, "").slice(0, length);
    
    const newOtp = new Array(length).fill("");
    for (let i = 0; i < sanitizedData.length; i++) {
      newOtp[i] = sanitizedData[i];
    }
    
    setOtp(newOtp);
    onChange?.(newOtp.join(""));
    
    // Focus the next empty input or last input
    const nextIndex = Math.min(sanitizedData.length, length - 1);
    inputRefs.current[nextIndex]?.focus();

    // Check if OTP is complete
    if (sanitizedData.length === length) {
      onComplete?.(sanitizedData);
    }
  };

  const baseInputClass = `
    w-12 h-12 text-center text-lg font-semibold rounded-lg border-2 
    bg-white dark:bg-gray-800 
    text-gray-900 dark:text-white 
    placeholder-gray-400 dark:placeholder-gray-500
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-blue-500/20
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const getBorderClass = (hasValue: boolean) => {
    if (error) {
      return "border-red-500 focus:border-red-500";
    }
    if (hasValue) {
      return "border-blue-500 focus:border-blue-600";
    }
    return "border-gray-300 dark:border-gray-600 focus:border-blue-500 hover:border-gray-400 dark:hover:border-gray-500";
  };

  return (
    <div className="flex items-center justify-center gap-3">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(ref) => {
            inputRefs.current[index] = ref;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          placeholder={digit ? "" : placeholder}
          disabled={disabled}
          className={`${baseInputClass} ${getBorderClass(!!digit)}`}
          autoComplete="off"
        />
      ))}
    </div>
  );
}