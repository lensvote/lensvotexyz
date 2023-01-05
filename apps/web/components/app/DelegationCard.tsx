import { useState } from "react"
import { useBlockNumber, useContractRead } from "wagmi"
import { BigNumber } from "ethers"
import Jazzicon, { jsNumberForAddress } from "react-jazzicon"
import { Profile, useProfileQuery } from "lens"
import { Card } from "@components/UI/Card"
import { ZERO_ADDRESS } from "@data/index"
import { formatHandle } from "@lib/formats"
import { useAppStore } from "@store/app"
import Follow from "@components/shared/Follow"
import Unfollow from "@components/shared/Unfollow"
import { useDebounce } from "@lib/hooks/useDebounce"
import { FollowNFT } from "abis"
import { Button } from "@components/UI/Button"
import { Modal } from "@components/UI/Modal"
import Delegation from "./Delegation"

const FollowResultCard = ({ profile }: { profile: Profile }) => {
  const avatarUri: string =
    (profile?.picture as any)?.original?.url ?? (profile?.picture as any)?.uri
  const isIpfs = avatarUri?.trim().startsWith("ipfs")
  const [hasFollowed, setHasFollowed] = useState(profile.isFollowedByMe)

  return (
    <Card className="border-[#E7E8EA] border">
      <div className="px-3 py-2 space-y-2">
        <div className="flex flex-shrink-0">
          <div className="flex items-center">
            <div className="flex items-center">
              {avatarUri && !isIpfs ? (
                <img
                  className="inline-block h-8 w-8 rounded-full"
                  src={avatarUri}
                  alt={formatHandle(profile?.handle)}
                />
              ) : (
                <Jazzicon
                  diameter={36}
                  seed={jsNumberForAddress(profile?.ownedBy ?? ZERO_ADDRESS)}
                />
              )}
            </div>
            <div className="ml-3 space-y-1">
              <p className="font-semibold">
                {profile?.name ?? formatHandle(profile?.handle)}
              </p>
              <p className="text-[#74767A] text-xs font-medium">
                @{formatHandle(profile?.handle, true)}
              </p>
            </div>
          </div>
        </div>

        {hasFollowed ? (
          <Unfollow
            className="w-full flex justify-center"
            profile={profile}
            setFollowing={setHasFollowed}
            showText
          />
        ) : (
          <Follow
            className="w-full flex justify-center"
            profile={profile}
            setFollowing={setHasFollowed}
            showText
          />
        )}
      </div>
    </Card>
  )
}

const DelegationCard = () => {
  const currentProfile = useAppStore((state) => state.currentProfile)
  const [query, setQuery] = useState<string>()
  const [effectiveQuery, setEffectiveQuery] = useState<string>()
  useDebounce(() => setEffectiveQuery(query), 300, [query])

  const handle = formatHandle(effectiveQuery as string, true)
  // TODO: Add loading ui
  const { data } = useProfileQuery({
    variables: { request: { handle }, who: currentProfile?.id },
    skip: !handle,
  })
  const profile = data?.profile as Profile | undefined
  // The delegation power current user has
  // Hardcoded version
  // const delegationPower = profile?.isFollowedByMe ? 1 : 0
  const { data: blockNumber } = useBlockNumber()
  const { data: delegationPower } = useContractRead({
    abi: FollowNFT,
    address: profile?.followNftAddress,
    functionName: "getPowerByBlockNumber",
    args:
      currentProfile && blockNumber
        ? [currentProfile.ownedBy, BigNumber.from(blockNumber)]
        : undefined,
  })

  const [isDelegating, setIsDelegating] = useState(false)
  const handleDelegate = () => {
    if (!profile) {
      return
    }

    setIsDelegating(true)
  }

  return (
    <>
      <Card>
        <div className="py-4 px-3 space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">Who you want vote for</h4>
            <input
              type="text"
              className="w-full bg-[#F4F4F4] rounded border-none"
              value={query}
              onChange={(evt) => setQuery(evt.target.value)}
            />
            {profile && currentProfile && (
              <FollowResultCard profile={profile} />
            )}
          </div>

          <div>
            <h4 className="font-semibold">Voting power</h4>
            <p className="text-[#090909] text-sm">
              {delegationPower?.toString() ?? 0}
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="font-semibold">how to get voting power</h4>
            <div className="text-[#18191C] text-sm">
              <p>
                <span className="font-semibold">Step1:</span> Follow this person
                and get at least one followerNFT
              </p>
              <p>
                <span className="font-semibold">Step2:</span> Delegate your
                voting power to an address(this address can be yourself or a
                third party)
              </p>
            </div>
          </div>

          <div>
            <Button disabled={!profile} onClick={handleDelegate}>
              Delegate
            </Button>
          </div>
        </div>
      </Card>

      <Modal
        title="Delegation"
        show={isDelegating}
        onClose={() => setIsDelegating(false)}
      >
        <Delegation
          delegateTo={currentProfile?.ownedBy}
          followNFTAddress={profile?.followNftAddress}
        />
      </Modal>
    </>
  )
}

export default DelegationCard
