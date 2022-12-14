import LoginButton from "@components/navbar/LoginButton"
import SignedUser from "@components/navbar/SignedUser"
import { useAppStore } from "@store/app"

const User = () => {
  const currentProfile = useAppStore((state) => state.currentProfile)

  if (!currentProfile) {
    return <LoginButton />
  }

  return <SignedUser />
}

export default User
