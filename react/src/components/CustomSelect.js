import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
export default function CustomSelect({ value, options, renderTrigger, renderOption, onChange, className }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        function onOutside(e) {
            if (!ref.current?.contains(e.target))
                setOpen(false);
        }
        document.addEventListener("mousedown", onOutside);
        return () => document.removeEventListener("mousedown", onOutside);
    }, []);
    function select(val) {
        onChange(val);
        setOpen(false);
    }
    const selected = options.find(o => o.value === value);
    return (_jsxs("div", { className: `custom-select${className ? ` ${className}` : ""}`, ref: ref, children: [_jsx("button", { type: "button", className: "custom-select-trigger", onClick: () => setOpen(o => !o), children: renderTrigger(selected) }), open && (_jsx("div", { className: "custom-select-dropdown", children: options.map(opt => (_jsx("button", { type: "button", className: `custom-select-option${opt.value === value ? " is-selected" : ""}`, onClick: () => select(opt.value), children: renderOption(opt) }, opt.value))) }))] }));
}
