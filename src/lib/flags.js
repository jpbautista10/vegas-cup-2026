const ISO = {
  mexico: "MX", austria: "AT", usa: "US", "united states": "US", germany: "DE", brazil: "BR", japan: "JP",
  argentina: "AR", france: "FR", spain: "ES", italy: "IT", england: "GB", "united kingdom": "GB", uk: "GB",
  portugal: "PT", netherlands: "NL", holland: "NL", belgium: "BE", croatia: "HR", switzerland: "CH",
  canada: "CA", colombia: "CO", chile: "CL", peru: "PE", uruguay: "UY", ecuador: "EC", venezuela: "VE",
  poland: "PL", ukraine: "UA", russia: "RU", turkey: "TR", greece: "GR", sweden: "SE", norway: "NO",
  denmark: "DK", finland: "FI", iceland: "IS", ireland: "IE", scotland: "GB", "czech republic": "CZ", czechia: "CZ",
  slovakia: "SK", slovenia: "SI", hungary: "HU", romania: "RO", bulgaria: "BG", serbia: "RS", bosnia: "BA",
  albania: "AL", morocco: "MA", algeria: "DZ", tunisia: "TN", egypt: "EG", nigeria: "NG", ghana: "GH",
  senegal: "SN", cameroon: "CM", "south africa": "ZA", "ivory coast": "CI", kenya: "KE", ethiopia: "ET",
  china: "CN", "south korea": "KR", korea: "KR", "north korea": "KP", india: "IN", pakistan: "PK", iran: "IR",
  iraq: "IQ", israel: "IL", "saudi arabia": "SA", qatar: "QA", uae: "AE", "united arab emirates": "AE",
  jordan: "JO", lebanon: "LB", thailand: "TH", vietnam: "VN", philippines: "PH", indonesia: "ID",
  malaysia: "MY", singapore: "SG", australia: "AU", "new zealand": "NZ", fiji: "FJ",
  "costa rica": "CR", panama: "PA", honduras: "HN", guatemala: "GT", "el salvador": "SV", nicaragua: "NI",
  cuba: "CU", jamaica: "JM", haiti: "HT", "dominican republic": "DO", "puerto rico": "PR", paraguay: "PY", bolivia: "BO",
  armenia: "AM", georgia: "GE", azerbaijan: "AZ", kazakhstan: "KZ", luxembourg: "LU", malta: "MT", cyprus: "CY",
  estonia: "EE", latvia: "LV", lithuania: "LT", belarus: "BY", moldova: "MD", montenegro: "ME", "north macedonia": "MK",
  kosovo: "XK", wales: "GB", monaco: "MC", liechtenstein: "LI", andorra: "AD",
};

export function isoOf(name) {
  if (!name) return null;
  return ISO[name.trim().toLowerCase()] || null;
}

/** Emoji flag — for toasts / plain-text only. Prefer <Flag /> in UI. */
export function flagOf(name) {
  const code = isoOf(name);
  if (!code) return "🏳️";
  return code.toUpperCase().replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

export function flagUrl(name, width = 80) {
  const code = isoOf(name);
  if (!code) return null;
  return `https://flagcdn.com/w${width}/${code.toLowerCase()}.png`;
}
