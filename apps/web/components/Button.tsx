import React, { PropsWithChildren } from "react"

export const Button = ({ children }: PropsWithChildren) => {
  return <button className="bg-red-300">{children ?? 'boop'}</button>
}
