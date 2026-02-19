import { useState, useEffect, useRef } from "react";

export interface Option {
  value: string;
  label: string;
}

interface Props {
  value: string;
  options: Option[];
  renderTrigger: (option: Option | undefined) => React.ReactNode;
  renderOption: (option: Option) => React.ReactNode;
  onChange: (value: string) => void;
  className?: string;
}

export default function CustomSelect({ value, options, renderTrigger, renderOption, onChange, className }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  function select(val: string) {
    onChange(val);
    setOpen(false);
  }

  const selected = options.find(o => o.value === value);

  return (
    <div className={`custom-select${className ? ` ${className}` : ""}`} ref={ref}>
      <button type="button" className="custom-select-trigger" onClick={() => setOpen(o => !o)}>
        {renderTrigger(selected)}
      </button>
      {open && (
        <div className="custom-select-dropdown">
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              className={`custom-select-option${opt.value === value ? " is-selected" : ""}`}
              onClick={() => select(opt.value)}
            >
              {renderOption(opt)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
