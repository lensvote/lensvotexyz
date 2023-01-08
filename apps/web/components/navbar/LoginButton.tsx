import Login from "@components/shared/Login"
import { Button } from "@components/UI/Button"
import { Modal } from "@components/UI/Modal"
import React, { useState } from "react"

const LoginButton = () => {
  const [showLoginModal, setShowLoginModal] = useState(false)

  const closeModal = () => setShowLoginModal(false)

  return (
    <>
      <Modal
        title="Login"
        show={showLoginModal}
        onClose={closeModal}
      >
        <Login onNext={closeModal} />
      </Modal>
      <Button
        className="text-sm"
        onClick={closeModal}
      >
        Login
      </Button>
    </>
  )
}

export default LoginButton
