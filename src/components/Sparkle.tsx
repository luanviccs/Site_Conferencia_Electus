/** Brilho de 4 pontas (referência cromada). Use poucas vezes, só como acento. */
export default function Sparkle({ className = "" }: { className?: string }) {
  return <svg aria-hidden viewBox="0 0 100 100" className={className}><path fill="currentColor" d="M50 0C53 30 70 47 100 50C70 53 53 70 50 100C47 70 30 53 0 50C30 47 47 30 50 0Z" /></svg>;
}
