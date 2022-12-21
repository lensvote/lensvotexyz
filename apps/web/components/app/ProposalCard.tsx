import React from "react"
import { Button } from "@components/UI/Button"
import { Card } from "@components/UI/Card"
import { GovernorProposal, ProposalState } from "@lib/hooks/useGovernorContract"
import { BigNumber } from "ethers"

type ProposalCardProps = {
  proposal: GovernorProposal
  displayVote?: boolean
}

const getPercentage = (val: BigNumber, total: BigNumber) => {
  return val.eq(0) ? 0 : val.mul(100).div(total)
}

const ProposalCard = ({ proposal, displayVote }: ProposalCardProps) => {
  const {
    forVotes,
    againstVotes,
    abstainVotes,
    // Threshold to pass
    quorumVotes,
    id,
    description,
    proposer,
    canceled,
    executed,
    eta,
    startBlock,
    endBlock,
    state,
  } = proposal
  const totalVotes = forVotes.add(abstainVotes).add(againstVotes)

  return (
    <Card>
      <div className="space-y-2 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-semibold">{id.toString()}</h3>
            <p className="text-sm text-[#939599]">
              @{proposer.slice(0, 4)}...{proposer.slice(-4)}
            </p>
          </div>
          <Button size="sm" variant="success" disabled>
            {ProposalState[state]}
          </Button>
        </div>

        <p className="text-sm text-[#18191C]">{description}</p>
        {displayVote && (
          <div className="text-[#090909]">
            <div className="flex justify-between relative px-2 py-1">
              <div
                className="bg-[#EFF4F4] absolute left-0 top-0 right-0 bottom-0"
                style={{
                  width: `${getPercentage(forVotes, totalVotes)}%`,
                }}
              />
              <p className="font-medium relative">For</p>
              <p className="font-medium relative">{forVotes.toString()}</p>
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
