import { Hero } from "../components"
import { Footer } from "@components/shared/Footer"
import { Features } from "../components/home/Features"
import { Roadmap } from "../components/common/Roadmap"

export default function Web() {
  return (
    <>
      <Hero />
      <Features />
      <Roadmap />
      <Footer />
    </>
  )
}
