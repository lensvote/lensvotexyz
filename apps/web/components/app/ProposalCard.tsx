import React from "react"
import { Button } from "@components/UI/Button"
import { Card } from "@components/UI/Card"
import { GovernorProposal } from "@lib/hooks/useGovernorContract"
import { BigNumber, BigNumberish } from "ethers"

type ProposalCardProps = {
  proposal: GovernorProposal
  displayVote?: boolean
}

const getPercentage = (val: BigNumberish, total: BigNumberish) => {
  const bigVal = BigNumber.from(val)
  return bigVal.eq(0) ? 0 : bigVal.mul(100).div(total)
}

const ProposalCard = ({ proposal, displayVote }: ProposalCardProps) => {
  const {
    agreeVotes,
    againstVotes,
    abstainVotes,
    id,
    description,
    proposer,
    status,
  } = proposal
  const totalVotes = BigNumber.from(agreeVotes)
    .add(abstainVotes)
    .add(againstVotes)

  const [voteId] = id.toString().split("|")

  return (
    <Card>
      <div className="space-y-2 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-semibold">{voteId}</h3>
            <p className="text-sm text-[#939599]">
              @{proposer.id.slice(0, 4)}...{proposer.id.slice(-4)}
            </p>
          </div>
          <Button className="lowercase" size="sm" variant="success" disabled>
            {status}
          </Button>
        </div>

        <p className="text-sm text-[#18191C]">
          {description || "No description"}
        </p>
        {displayVote && (
          <div className="text-[#090909]">
            <div className="flex justify-between relative px-2 py-1">
              <div
                className="bg-[#EFF4F4] absolute left-0 top-0 right-0 bottom-0"
                style={{
                  width: `${getPercentage(agreeVotes, totalVotes)}%`,
                }}
              />
              <p className="font-medium relative">For</p>
              <p className="font-medium relative">{agreeVotes.toString()}</p>
            </div>
            <div className="flex justify-between relative px-2 py-1">
              <div
                className="bg-[#EFF4F4] absolute left-0 top-0 right-0 bottom-0"
                style={{
                  width: `${getPercentage(againstVotes, totalVotes)}%`,
                }}
              />
              <p className="font-medium relative">Against</p>
              <p className="font-medium relative">{againstVotes.toString()}</p>
            </div>
            <div className="flex justify-between relative px-2 py-1">
              <div
                className="bg-[#EFF4F4] absolute left-0 top-0 right-0 bottom-0"
                style={{
                  width: `${getPercentage(abstainVotes, totalVotes)}%`,
                }}
              />
              <p className="font-medium relative">Abstain</p>
              <p className="font-medium relative">{abstainVotes.toString()}</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

export default ProposalCard
