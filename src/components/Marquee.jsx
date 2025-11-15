export default function Marquee({ items = [
  "CERAMIC PRO",
  "MEGUIAR'S",
  "3M",
  "SONAX",
  "GTECHNIQ",
  "KOCH-CHEMIE",
] }) {
  const content = [...items, ...items];
  return (
    <section className="relative py-8 sm:py-10 bg-black border-y border-white/10">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black to-transparent z-10" />
      <div className="overflow-hidden">
        <div className="flex gap-12 whitespace-nowrap will-change-transform animate-[marquee_20s_linear_infinite]">
          {content.map((label, i) => (
            <span
              key={i}
              className="text-sm sm:text-base tracking-[0.2em] uppercase text-white/30 hover:text-white/80 transition-colors"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>
    </section>
  );
}
