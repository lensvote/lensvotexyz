import { HANDLE_SUFFIX } from "@data/constants"

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

export const formatHandle = (handle?: string | null, keepSuffix = false) => {
  if (!handle) {
    return ""
  }

  if (handle?.toLowerCase() === "lensprotocol") {
    return handle
  }

  if (keepSuffix) {
    return handle.endsWith(HANDLE_SUFFIX) ? handle : handle + HANDLE_SUFFIX
  }

  return handle.replace(HANDLE_SUFFIX, "")
}

export const formatAddress = (address?: string) => {
  if (!address) {
    return ""
  }

  return `${address.slice(0, 4)}...${address.slice(-4)}`
}
