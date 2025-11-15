import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronsUpDown, Search } from 'lucide-react';

export default function SearchSelect({
  value,
  onChange,
  options = [],
  placeholder = 'Select...',
  disabled = false,
  className = '',
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const rootRef = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  useEffect(() => {
    // Keep input in sync with selected value if user hasn't typed
    if (!open) setQuery('');
  }, [open, value]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, query]);

  return (
    <div ref={rootRef} className={`relative ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`}>
      <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 text-white backdrop-blur-sm focus-within:border-primary/50 transition-all">
        <Search className="w-4 h-4 text-white/50" />
        <input
          type="text"
          className="flex-1 bg-transparent outline-none text-white placeholder:text-white/40"
          placeholder={value || placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />
        <button type="button" className="text-white/60" onClick={() => setOpen((s) => !s)}>
          <ChevronsUpDown className="w-4 h-4" />
        </button>
      </div>
      {open && (
        <div className="absolute z-30 mt-1 w-full max-h-56 overflow-auto bg-black/90 border border-white/10 backdrop-blur-xl shadow-xl">
          {filtered.length === 0 ? (
            <div className="px-3 py-2 text-white/50 text-sm">No matches</div>
          ) : (
            filtered.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange && onChange(opt);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm ${
                  opt === value ? 'bg-primary/20 text-primary' : 'text-white hover:bg-white/10'
                }`}
              >
                {opt}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
