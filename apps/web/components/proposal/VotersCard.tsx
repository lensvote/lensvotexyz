import { useState } from "react"
import Jazzicon, { jsNumberForAddress } from "react-jazzicon"
import { Card } from "@components/UI/Card"
import { ZERO_ADDRESS } from "@data/index"
import { formatAddress } from "@lib/formats"
import { Vote } from "@lib/hooks/useGovernorContract"

// let count = 0
// const hundredXVotes: Vote[] = Array(100).fill({
//   id: count++,
//   power: count,
//   support: "against",
//   voter: { id: "0x...123090219301202931" },
// })

const VotersCard = ({ votes }: { votes?: Vote[] }) => {
  const [showMore, setShowMore] = useState(false)
  const isVotesMoreThanSix = (votes?.length ?? 0) > 6
  const displayedVotes =
    isVotesMoreThanSix && !showMore ? votes?.slice(0, 6) : votes

  if (!displayedVotes?.length) {
    return null
  }

  return (
    <Card className="overflow-hidden">
      <div className="p-4 pb-0 text-sm font-medium">
        <h6>number of votes</h6>

        <div className="divide-y mt-2">
          {displayedVotes.map((vote) => {
            const voterAddress = vote.voter.id

            return (
              <div
                className="flex items-center justify-between py-3"
                key={vote.id}
              >
                <div className="inline-flex items-center gap-2">
                  <Jazzicon
                    diameter={24}
                    seed={jsNumberForAddress(voterAddress ?? ZERO_ADDRESS)}
                  />
                  {formatAddress(voterAddress)}
                </div>
                <p className="capitalize">{vote.support}</p>
                <p>{vote.power}</p>
              </div>
            )
          })}
        </div>

        {isVotesMoreThanSix && (
          <>
            {!showMore && (
              <div className="relative -mt-36 w-full h-36 bg-gradient-to-t from-white to-transparent" />
            )}
            <button
              className="w-full inline-flex justify-center font-semibold underline p-4"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? "Show less" : "Show More"}
            </button>
          </>
        )}
      </div>
    </Card>
  )
}

export default VotersCard
