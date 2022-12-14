import { AppProps } from "next/app"
import "@fontsource/poppins"
import "@fontsource/poppins/900.css"
import "@fontsource/poppins/700.css"
import "@fontsource/poppins/600.css"
import "@fontsource/poppins/500.css"
import "../styles.css"
import { lazy } from "react"
import Layout from "@components/shared/Layout"

const Providers = lazy(() => import("../components/common/Providers"))

export default function LensVote({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Providers>
  )
}
