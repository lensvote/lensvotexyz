import { useState } from "react"
import type { Dispatch, FC } from "react"
import { ethers, Signer } from "ethers"
import { Contract } from "ethers"
import { useSigner, useSignTypedData } from "wagmi"
import clsx, { ClassValue } from "clsx"

import { Button } from "@components/UI/Button"
import { Spinner } from "@components/UI/Spinner"
import { useAppStore } from "@store/app"
import useBroadcast from "@lib/hooks/useBroadcast"
import { getSignature } from "@lib/getSignature"
import { FollowNFT } from "abis"
import { RELAY_ON } from "data/constants"
import type { CreateBurnEip712TypedData, Profile } from "lens"
import { useCreateUnfollowTypedDataMutation } from "lens"
import { ApolloCache } from "@apollo/client"

interface Props {
  profile: Profile
  setFollowing: Dispatch<boolean>
  showText?: boolean
  className?: ClassValue
}

const Unfollow: FC<Props> = ({
  profile,
  showText = false,
  setFollowing,
  className,
}) => {
  const currentProfile = useAppStore((state) => state.currentProfile)
  const [writeLoading, setWriteLoading] = useState(false)
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData()
  const { data: signer } = useSigner()

  const updateCache = (cache: ApolloCache<any>) => {
    cache.modify({
      id: `Profile:${profile?.id}`,
      fields: {
        isFollowedByMe: () => false,
      },
    })
  }

  const burnWithSig = async (
    signature: string,
    typedData: CreateBurnEip712TypedData,
  ) => {
    const { tokenId, deadline } = typedData.value
    const { v, r, s } = ethers.utils.splitSignature(signature)
    const sig = { v, r, s, deadline }

    const followNftContract = new Contract(
      typedData.domain.verifyingContract,
      FollowNFT,
      signer as Signer,
    )

    const tx = await followNftContract.burnWithSig(tokenId, sig)
    if (tx) {
      setFollowing(false)
    }
  }

  const { broadcast } = useBroadcast({
    onCompleted: () => {
      setFollowing(false)
    },
  })

  const [createUnfollowTypedData, { loading: typedDataLoading }] =
    useCreateUnfollowTypedDataMutation({
      onCompleted: async ({ createUnfollowTypedData }) => {
        try {
          const { typedData, id } = createUnfollowTypedData
          const signature = await signTypedDataAsync(getSignature(typedData))

          setWriteLoading(true)
          try {
            if (!RELAY_ON) {
              return await burnWithSig(signature, typedData)
            }
            const { data } = await broadcast({ request: { id, signature } })
            if (data?.broadcast?.reason) {
              await burnWithSig(signature, typedData)
            }
            // do something when successed
          } catch {
            // do something when errror
          } finally {
            setWriteLoading(false)
          }
        } catch {}
      },
      update: updateCache,
    })

  const createUnfollow = () => {
    if (!currentProfile) {
      // Do something when error
      return
    }

    createUnfollowTypedData({
      variables: {
        request: { profile: profile?.id },
      },
    })
  }

  return (
    <Button
      className={clsx("text-sm !px-3 !py-1.5", className)}
      rounded
      size="sm"
      outline
      onClick={createUnfollow}
      disabled={typedDataLoading || signLoading || writeLoading}
      aria-label="Unfollow"
      icon={
        (typedDataLoading || signLoading || writeLoading) && (
          <Spinner variant="secondary" size="xs" />
        )
      }
    >
      {showText && "Unfollow"}
    </Button>
  )
}

export default Unfollow
