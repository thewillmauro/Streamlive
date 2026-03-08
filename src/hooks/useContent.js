import { useState, useEffect } from "react";

let cache = null;
let fetchPromise = null;

export function useContent() {
  const [content, setContent] = useState(cache);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    if (cache) { setContent(cache); setLoading(false); return; }
    if (!fetchPromise) {
      fetchPromise = fetch("/api/content")
        .then(r => r.ok ? r.json() : null)
        .then(d => { cache = d?.content || {}; return cache; })
        .catch(() => { cache = {}; return cache; });
    }
    fetchPromise.then(c => { setContent(c); setLoading(false); });
  }, []);

  const get = (section, key, fallback) => {
    if (!content || !content[section]) return fallback;
    const val = content[section][key];
    if (val === undefined || val === null) return fallback;
    // JSONB stores strings with extra quotes, unwrap if needed
    if (typeof val === "string" && typeof fallback === "string") return val;
    return val;
  };

  return { content, loading, get };
}
