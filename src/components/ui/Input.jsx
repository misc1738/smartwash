import React from 'react';

export default function Input({ label, id, className, ...props }) {
  return (
    <div className={className}>
      {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>}
      <input
        id={id}
        {...props}
        className="mt-1 block w-full rounded p-2 border border-[hsl(var(--input)/0.9)] bg-[hsl(var(--card)/1)] text-[hsl(var(--card-foreground)/1)] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring)/0.6)]"
      />
    </div>
  );
}
