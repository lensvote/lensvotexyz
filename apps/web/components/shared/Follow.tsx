import type { ApolloCache } from "@apollo/client"
import { Button } from "@components/UI/Button"
import { Spinner } from "@components/UI/Spinner"
import { UserPlusIcon } from "@heroicons/react/24/solid"
import clsx, { ClassValue } from "clsx"
import { omit } from "@lib/omit"
import { LensHubProxy } from "abis"
import useBroadcast from "@lib/hooks/useBroadcast"
import { LENSHUB_PROXY, RELAY_ON } from "@data/constants"
import { utils } from "ethers"
import type { Profile } from "lens"
import { useCreateFollowTypedDataMutation, useProxyActionMutation } from "lens"
import type { Dispatch, FC } from "react"
import { useAppStore } from "store/app"
import { useAccount, useContractWrite, useSignTypedData } from "wagmi"

interface Props {
  profile: Profile
  setFollowing: Dispatch<boolean>
  showText?: boolean
  className?: ClassValue
}

const Follow: FC<Props> = ({
  profile,
  showText = false,
  setFollowing,
  className,
}) => {
  const userSigNonce = useAppStore((state) => state.userSigNonce)
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce)
  const currentProfile = useAppStore((state) => state.currentProfile)
  const { address } = useAccount()

  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData()

  const onCompleted = () => {
    setFollowing(true)
  }

  const updateCache = (cache: ApolloCache<any>) => {
    cache.modify({
      id: `Profile:${profile?.id}`,
      fields: {
        isFollowedByMe: () => true,
      },
    })
  }

  const { isLoading: writeLoading, write } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LensHubProxy,
    functionName: "followWithSig",
    mode: "recklesslyUnprepared",
    onSuccess: onCompleted,
  })

  const { broadcast, loading: broadcastLoading } = useBroadcast({ onCompleted })
  const [createFollowTypedData, { loading: typedDataLoading }] =
    useCreateFollowTypedDataMutation({
      onCompleted: async ({ createFollowTypedData }) => {
        const { id, typedData } = createFollowTypedData
        const { deadline } = typedData.value

        try {
          // TODO: Replace deep clone with right helper
          const signature = await signTypedDataAsync({
            domain: omit(typedData.domain, "__typename"),
            types: omit(typedData.types, "__typename"),
            value: omit(typedData.value, "__typename"),
          })
          setUserSigNonce(userSigNonce + 1)
          const { profileIds, datas: followData } = typedData.value
          const { v, r, s } = utils.splitSignature(signature)
          const sig = { v, r, s, deadline }
          const inputStruct = {
            follower: address,
            profileIds,
            datas: followData,
            sig,
          }
          if (!RELAY_ON) {
            return write?.({ recklesslySetUnpreparedArgs: [inputStruct] })
          }

          const {
            data: { broadcast: result },
          } = await broadcast({ request: { id, signature } })

          if ("reason" in result) {
            write?.({ recklesslySetUnpreparedArgs: [inputStruct] })
          }
        } catch {}
      },
      update: updateCache,
    })

  const [createFollowProxyAction, { loading: proxyActionLoading }] =
    useProxyActionMutation({
      onCompleted,
      update: updateCache,
    })

  const createViaProxyAction = async (variables: any) => {
    const { data } = await createFollowProxyAction({
      variables,
    })
    if (!data?.proxyAction) {
      createFollowTypedData({
        variables: {
          request: { follow: [{ profile: profile?.id }] },
          options: { overrideSigNonce: userSigNonce },
        },
      })
    }
  }

  const createFollow = () => {
    if (!currentProfile) {
      return
    }

    createViaProxyAction({
      request: {
        follow: {
          freeFollow: {
            profileId: profile?.id,
          },
        },
      },
    })

    if (profile?.followModule) {
      createFollowTypedData({
        variables: {
          options: { overrideSigNonce: userSigNonce },
          request: {
            follow: [
              {
                profile: profile?.id,
                followModule:
                  profile?.followModule?.__typename ===
                  "ProfileFollowModuleSettings"
                    ? { profileFollowModule: { profileId: currentProfile?.id } }
                    : null,
              },
            ],
          },
        },
      })
    } else {
      createViaProxyAction({
        request: {
          follow: {
            freeFollow: {
              profileId: profile?.id,
            },
          },
        },
      })
    }
  }

  const isLoading =
    typedDataLoading ||
    proxyActionLoading ||
    signLoading ||
    writeLoading ||
    broadcastLoading

  return (
    <Button
      className={clsx("text-sm !px-3 !py-1.5", className)}
      rounded
      size="sm"
      onClick={createFollow}
      aria-label="Follow"
      disabled={isLoading}
      icon={isLoading && <Spinner variant="secondary" size="xs" />}
    >
      {showText && "Follow"}
    </Button>
  )
}

export default Follow
