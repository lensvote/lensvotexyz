import React, { PropsWithChildren } from "react"
import { ClickToComponent } from "click-to-react-component"
import { Profile, useUserProfilesQuery } from "lens"
import { Header } from "@components/Header"
import { useAccount } from "wagmi"
import { useAppStore, useAppPersistStore } from "@store/app"
import { useRouter } from "next/router"

const Layout = ({ children }: PropsWithChildren) => {
  const setProfiles = useAppStore((state) => state.setProfiles)
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce)
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile)
  const profileId = useAppPersistStore((state) => state.profileId)
  const setProfileId = useAppPersistStore((state) => state.setProfileId)
  const router = useRouter()

  const { address } = useAccount()

  const resetAuthState = () => {
    setProfileId(null)
    setCurrentProfile(null)
  }

  // Fetch current profiles and sig nonce owned by the wallet address
  useUserProfilesQuery({
    variables: { ownedBy: address },
    skip: !profileId,
    onCompleted: (data) => {
      const profiles = data?.profiles?.items
        ?.slice()
        ?.sort((a, b) => Number(a.id) - Number(b.id))
        ?.sort((a, b) =>
          a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1,
        )
      console.log("🚀 ~ file: Layout.tsx:30 ~ Layout ~ profiles", profiles)

      if (!profiles.length) {
        return resetAuthState()
      }

      const selectedUser = profiles.find((profile) => profile.id === profileId)

      setProfiles(profiles as Profile[])
      setCurrentProfile(selectedUser as Profile)
      setProfileId(selectedUser?.id)
      setUserSigNonce(data?.userSigNonces?.lensHubOnChainSigNonce)
    },
    onError: () => {
      setProfileId(null)
    },
  })

  console.log("🚀 ~ file: Layout.tsx:56 ~ Layout ~ router", router)
  return (
    <>
      <Header isLandingPage={router.asPath === "/"} />
      <main>{children}</main>
      <ClickToComponent />
    </>
  )
}

export default Layout
