import { AppProps } from "next/app"
import "@fontsource/poppins"
import "@fontsource/poppins/900.css"
import "@fontsource/poppins/700.css"
import "@fontsource/poppins/600.css"
import "@fontsource/poppins/500.css"
import "../styles.css"

export default function LensVote({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
    </>
  )
}
