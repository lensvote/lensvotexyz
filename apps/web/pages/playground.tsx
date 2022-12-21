import LoginButton from "@components/navbar/LoginButton"
import Follow from "@components/shared/Follow"
import { Spinner } from "@components/UI/Spinner"
import React from "react"

const Playground = () => {
  return (
    <>
      {/* <LoginButton /> */}
      {/* <Follow /> */}
      <div className="flex flex-col gap-4">
        <Spinner variant="danger" />
        <Spinner variant="primary" />
        <Spinner variant="secondary" />
        <Spinner variant="success" />
        <Spinner variant="super" />
        <Spinner variant="warning" />
      </div>
    </>
  )
}

export default Playground
