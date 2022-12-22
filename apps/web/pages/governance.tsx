import { Fragment } from "react"
import EnableGovernance from "@components/settings/EnableGovernance"
import { Footer } from "@components/shared/Footer"

const Governance = () => {
  return (
    <Fragment>
      <div className="bg-gray-50 h-[70vh]">
        <div className="max-w-4xl mx-auto p-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
            <EnableGovernance />
          </div>
        </div>
      </div>
      <Footer />
    </Fragment>
  )
}

export default Governance
