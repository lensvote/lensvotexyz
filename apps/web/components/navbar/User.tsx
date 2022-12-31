import { NextLink } from "@components/common/NextLink"
import LoginButton from "@components/navbar/LoginButton"
import SignedUser from "@components/navbar/SignedUser"
import { useAppStore } from "@store/app"

const User = () => {
  const currentProfile = useAppStore((state) => state.currentProfile)

  if (!currentProfile) {
    return <LoginButton />
  }

  return (
    <div className="flex items-center gap-6">
      <NextLink href="/governance">Governance</NextLink>
      <NextLink href="/create-proposal">Create Proposal</NextLink>
      <SignedUser />
    </div>
  )
}

export default User
