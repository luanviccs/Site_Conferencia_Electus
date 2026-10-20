import { useEffect, useState } from "react";
/** true enquanto a media query casar (reage a mudanças, ex.: girar o celular ou trocar a preferência de movimento). */
export function useMedia(query: string) {
  const [match, setMatch] = useState(() => typeof window !== "undefined" && matchMedia(query).matches);
  useEffect(() => {
    const mq = matchMedia(query), on = () => setMatch(mq.matches);
    on(); mq.addEventListener("change", on); return () => mq.removeEventListener("change", on);
  }, [query]);
  return match;
}
