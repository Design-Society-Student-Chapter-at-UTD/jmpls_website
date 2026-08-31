import { useEffect, useState } from "react";

export function useSiteContent<T>(key: string) {
  const [content, setContent] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch(`/api/content/${encodeURIComponent(key)}`)
      .then((response) => {
        if (!response.ok) throw new Error("Content unavailable");
        return response.json() as Promise<T>;
      })
      .then((value) => { if (active) setContent(value); })
      .catch((reason) => { if (active) setError(reason instanceof Error ? reason.message : "Content unavailable"); });
    return () => { active = false; };
  }, [key]);

  return { content, error };
}
