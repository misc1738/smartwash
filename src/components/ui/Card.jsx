import React from 'react';

export default function Card({ children, className }) {
  return (
    <div className={`bg-card text-card-foreground rounded-lg shadow-soft p-4 ${className || ''}`}>
      {children}
    </div>
  );
}
