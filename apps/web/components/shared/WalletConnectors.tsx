import SwitchNetwork from "@components/shared/SwitchNetwork"
import { Button } from "@components/UI/Button"
import { Spinner } from "@components/UI/Spinner"
import useIsMounted from "@components/utils/hooks/useIsMounted"
import { XCircleIcon } from "@heroicons/react/24/solid"
import { getWalletLogo } from "@lib/getWalletLogo"
import clsx from "clsx"
import { ERROR_MESSAGE, CHAIN_ID } from "@data/constants"
import {
  useAuthenticateMutation,
  useChallengeLazyQuery,
  useUserProfilesLazyQuery,
} from "lens"
import type { Dispatch, FC } from "react"
import { useState } from "react"
import { useAppPersistStore, useAppStore } from "@store/app"
import type { Connector } from "wagmi"
import { useAccount, useConnect, useNetwork, useSignMessage } from "wagmi"
import { Logo } from "@components/common/Logo"

interface Props {
  setHasConnected: Dispatch<boolean>
  setHasProfile: Dispatch<boolean>
}

const WalletSelector: FC<Props> = ({ setHasConnected, setHasProfile }) => {
  const setProfiles = useAppStore((state) => state.setProfiles)
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile)
  const setProfileId = useAppPersistStore((state) => state.setProfileId)
  const [loading, setLoading] = useState(false)

  const { mounted } = useIsMounted()
  const { chain } = useNetwork()
  const { connectors, error, connectAsync } = useConnect()
  const { address, connector: activeConnector } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const [loadChallenge, { error: errorChallenge }] = useChallengeLazyQuery({
    fetchPolicy: "no-cache",
  })
  const [authenticate, { error: errorAuthenticate }] = useAuthenticateMutation()
  const [getProfiles, { error: errorProfiles }] = useUserProfilesLazyQuery()

  const onConnect = async (connector: Connector) => {
    try {
      const account = await connectAsync({ connector })
      if (account) {
        setHasConnected(true)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleSign = async () => {
    try {
      setLoading(true)
      // Get challenge
      const challenge = await loadChallenge({
        variables: { request: { address } },
      })

      if (!challenge?.data?.challenge?.text) {
        return
      }

      // Get signature
      const signature = await signMessageAsync({
        message: challenge?.data?.challenge?.text,
      })

      // Auth user and set cookies
      const auth = await authenticate({
        variables: { request: { address, signature } },
      })
      localStorage.setItem("accessToken", auth.data?.authenticate.accessToken)
      localStorage.setItem("refreshToken", auth.data?.authenticate.refreshToken)

      // Get authed profiles
      const { data: profilesData } = await getProfiles({
        variables: { ownedBy: address },
      })
      console.log("🚀 ~ file: WalletConnectors.tsx:82 ~ handleSign ~ profilesData", profilesData)

      if (profilesData?.profiles?.items?.length === 0) {
        setHasProfile(false)
      } else {
        const profiles: any = profilesData?.profiles?.items
          ?.slice()
          ?.sort((a, b) => Number(a.id) - Number(b.id))
          ?.sort((a, b) =>
            a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1,
          )
        const currentProfile = profiles[0]
        setProfiles(profiles)
        setCurrentProfile(currentProfile)
        setProfileId(currentProfile.id)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return activeConnector?.id ? (
    <div className="space-y-3">
      {chain?.id === CHAIN_ID ? (
        <Button
          disabled={loading}
          icon={loading && <Spinner className="mr-0.5" size="xs" />}
          onClick={handleSign}
          size="sm"
          rounded
        >
          Sign-In with Lens
        </Button>
      ) : (
        <SwitchNetwork />
      )}
      {(errorChallenge || errorAuthenticate || errorProfiles) && (
        <div className="flex items-center space-x-1 font-bold text-red-500">
          <XCircleIcon className="w-5 h-5" />
          <div>{ERROR_MESSAGE}</div>
        </div>
      )}
    </div>
  ) : (
    <div className="inline-block overflow-hidden space-y-3 w-full text-left align-middle transition-all transform">
      {connectors.map((connector) => {
        return (
          <button
            type="button"
            key={connector.id}
            className={clsx(
              {
                "hover:bg-gray-100 dark:hover:bg-gray-700":
                  connector.id !== activeConnector?.id,
              },
              "w-full flex items-center justify-between space-x-2.5 px-4 py-3 overflow-hidden rounded-xl border dark:border-gray-700/80 outline-none",
            )}
            onClick={() => onConnect(connector)}
            disabled={
              mounted
                ? !connector.ready || connector.id === activeConnector?.id
                : false
            }
          >
            <span>
              {mounted
                ? connector.id === "injected"
                  ? "Browser Wallet"
                  : connector.name
                : connector.name}
              {mounted ? !connector.ready && " (unsupported)" : ""}
            </span>
            {/* Wallet icon svg */}
            <img
              src={getWalletLogo(connector.name)}
              draggable={false}
              className="w-6 h-6"
              height={24}
              width={24}
              alt={connector.id}
            />
          </button>
        )
      })}
      {error?.message ? (
        <div className="flex items-center space-x-1 text-red-500">
          <XCircleIcon className="w-5 h-5" />
          <div>{error?.message ?? "Failed to connect"}</div>
        </div>
      ) : null}
    </div>
  )
}

export default WalletSelector
