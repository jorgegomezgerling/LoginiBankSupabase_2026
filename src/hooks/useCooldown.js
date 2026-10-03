import { useEffect, useState } from "react";

const endsAt = {}; // { 'reset:jorge@mail.com': timestamp }

const secondsLeft = (key) =>
  endsAt[key] ? Math.max(0, Math.ceil((endsAt[key] - Date.now()) / 1000)) : 0;

export function startCooldown(key, seconds = 60) {
  endsAt[key] = Date.now() + seconds * 1000;
}

export function useCooldown(key) {
  const [left, setLeft] = useState(() => secondsLeft(key));

  useEffect(() => {
    setLeft(secondsLeft(key));
    const id = setInterval(() => setLeft(secondsLeft(key)), 1000);
    return () => clearInterval(id);
  }, [key]);

  return {
    secondsLeft: left,
    active: left > 0,
    start: (seconds = 60) => {
      startCooldown(key, seconds);
      setLeft(seconds);
    },
  };
}
