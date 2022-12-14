type Options = {
  // string representing exponent; defaults to using the "short" form.
  compact?: boolean
}

const defaultOptions: Options = {
  compact: false,
}

export const formatNumber = (val: number, { compact } = defaultOptions) => {
  const locale = "en-US"
  const formatter = new Intl.NumberFormat(locale, {
    notation: compact ? "compact" : "standard",
  })

  return formatter.format(val)
}
