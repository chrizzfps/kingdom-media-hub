/** Turns a dot-path field key like "cards.appointmentsLabel" into "Cards → Appointments Label". */
export function humanizeFieldKey(key: string): string {
  return key
    .split(".")
    .map((part) =>
      part
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/[-_]/g, " ")
        .replace(/^./, (c) => c.toUpperCase()),
    )
    .join(" → ");
}

const LONG_FIELD_HINTS = /desc|subtitle|quote|disclaimer|message|content|suffix$/i;

export function isLongTextField(fieldKey: string, currentValue: string): boolean {
  return LONG_FIELD_HINTS.test(fieldKey) || currentValue.length > 70 || fieldKey === "a";
}

export function humanizeGroupKey(key: string): string {
  return key
    .split(".")
    .map((part) => part.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/^./, (c) => c.toUpperCase()))
    .join(" → ");
}
