import { useEffect, useState } from "react";
export function useCountdown(startIso: string, endIso: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);
  const diff = Date.parse(startIso) - now;
  const status = diff > 0 ? "before" : now <= Date.parse(endIso) ? "live" : "after";
  const t = Math.max(0, Math.floor(diff / 1000));
  return { status, d: Math.floor(t / 86400), h: Math.floor(t / 3600) % 24, m: Math.floor(t / 60) % 60, s: t % 60 } as const;
}
