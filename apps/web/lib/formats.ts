type Options = {
  // string representing exponent; defaults to using the "short" form.
  compact?: boolean
}

const defaultOptions: Options = {
  compact: false,
}

const LOCALE = "en-US"
export const formatNumber = (val: number, { compact } = defaultOptions) => {
  const formatter = new Intl.NumberFormat(LOCALE, {
    notation: compact ? "compact" : "standard",
  })

  return formatter.format(val)
}

// Formats a timestamp to yyyy-mm-dd
export const formatDate = (val: number) => {
  const date = new Date(val)
  return date.toISOString().replace("T", " ").substring(0, 19)
}
