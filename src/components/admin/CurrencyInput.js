"use client";

import React from "react";

export default function CurrencyInput({
  value,
  onChange,
  className = "",
  placeholder = "0",
  required = false,
  label = "Harga",
  id,
}) {
  // Format the number to thousands separator (e.g. 1.000.000)
  const formatDisplay = (val) => {
    if (val === null || val === undefined || val === "") return "";
    const cleanNum = val.toString().replace(/\D/g, "");
    if (!cleanNum) return "";
    return new Intl.NumberFormat("id-ID").format(parseInt(cleanNum, 10));
  };

  const handleInputChange = (e) => {
    const rawVal = e.target.value;
    // Strip non-digits
    const numericString = rawVal.replace(/\D/g, "");
    const numericValue = numericString ? parseInt(numericString, 10) : 0;
    onChange(numericValue);
  };

  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-primary mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant font-semibold">
          Rp
        </span>
        <input
          type="text"
          id={id}
          value={formatDisplay(value)}
          onChange={handleInputChange}
          className={`w-full bg-surface border border-outline-variant rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-medium ${className}`}
          placeholder={placeholder}
          required={required}
        />
      </div>
    </div>
  );
}
