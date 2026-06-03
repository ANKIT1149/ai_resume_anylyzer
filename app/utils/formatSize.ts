/**
 * Convert a byte size to a human‑readable string using KB, MB, or GB.
 * - Uses a base of 1024.
 * - Defaults to 1 decimal place (e.g., 1.5 MB). Integers are shown without trailing .0.
 * - Returns "0 B" for invalid, negative, or zero inputs.
 */
export function formatSize(bytes: number, decimals: number = 1): string {
  // Guard against invalid numbers and negatives
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";

  const kib = 1024;
  const mib = kib * 1024;
  const gib = mib * 1024;

  const format = (value: number, unit: string) => {
    const fixed = value.toFixed(decimals);
    // Remove trailing ".0" when value is an integer after rounding
    const pretty = decimals > 0 && fixed.endsWith(".0") ? fixed.slice(0, -2) : fixed;
    return `${pretty} ${unit}`;
  };

  if (bytes < kib) {
    // Small sizes: show in bytes
    return `${bytes} B`;
  } else if (bytes < mib) {
    return format(bytes / kib, "KB");
  } else if (bytes < gib) {
    return format(bytes / mib, "MB");
  }
  return format(bytes / gib, "GB");
}

export default formatSize;

export const generateUUID = () => crypto.randomUUID()
