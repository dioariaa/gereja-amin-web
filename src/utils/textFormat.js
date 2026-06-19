const preservedWords = {
  amin: "AMIN",
  bphmj: "BPHMJ",
  cms: "CMS",
  csv: "CSV",
  fcms: "FCMS",
  hp: "HP",
  id: "ID",
  kkj: "KKJ",
  rt: "RT",
  rw: "RW",
  url: "URL",
  wib: "WIB",
};

function formatWord(word) {
  return word
    .split(/([/-])/)
    .map((part) => {
      if (!part || part === "/" || part === "-") return part;

      const match = part.match(/^([^A-Za-zÀ-ÿ]*)([A-Za-zÀ-ÿ.]+)(.*)$/);
      if (!match) return part;

      const [, prefix, core, suffix] = match;
      const normalizedCore = core.toLowerCase();
      const preserved = preservedWords[normalizedCore];

      if (preserved) return `${prefix}${preserved}${suffix}`;

      const credentialLike = core.includes(".") && /[A-Z]/.test(core);
      if (credentialLike) return `${prefix}${core}${suffix}`;

      return `${prefix}${normalizedCore.charAt(0).toUpperCase()}${normalizedCore.slice(1)}${suffix}`;
    })
    .join("");
}

export function toTitleCase(text) {
  if (text === null || text === undefined) return "";

  const normalizedText = String(text).trim().replace(/\s+/g, " ");
  if (!normalizedText) return "";

  return normalizedText.split(" ").map(formatWord).join(" ");
}
