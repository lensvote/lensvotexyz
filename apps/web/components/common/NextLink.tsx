import { PropsWithChildren } from "react"
import Link, { LinkProps } from "next/link"
import clsx, { ClassValue } from "clsx"

export const NextLink = (
  props: PropsWithChildren<LinkProps & { className?: ClassValue }>,
) => <Link {...props} className={clsx(props.className)} />
