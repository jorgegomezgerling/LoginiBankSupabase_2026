export function parseAuthUrl(url) {
  const params = {};
  if (!url) return params;

  const [beforeHash, hash = ""] = url.split("#");
  const query = beforeHash.includes("?") ? beforeHash.split("?")[1] : "";

  new URLSearchParams(query).forEach((v, k) => {
    params[k] = v;
  });
  new URLSearchParams(hash).forEach((v, k) => {
    params[k] = v;
  });
  return params;
}
