import Login from "@components/shared/Login"
import { Button } from "@components/UI/Button"
import { Modal } from "@components/UI/Modal"
import React, { useState } from "react"

const LoginButton = () => {
  const [showLoginModal, setShowLoginModal] = useState(false)

  return (
    <>
      <Modal
        title="Login"
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      >
        <Login />
      </Modal>
      <Button
        className="text-sm"
        onClick={() => setShowLoginModal(true)}
      >
        Login
      </Button>
    </>
  )
}

export default LoginButton
