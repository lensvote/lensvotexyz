import { BigNumber } from "ethers"
import { useEffect, useState } from "react"
import { useBlockNumber, useProvider } from "wagmi"
import { GovernorProposal, ProposalState } from "./useGovernorContract"

// 14 days in second
const TIMELOCK_GRACE_PERIOD = 14 * 60 * 60 * 60 * 24

export const getProposalState = async (
  proposal: GovernorProposal,
  blockNumber: number,
  blockTimestamp: number,
) => {
  const bigBlockNumber = BigNumber.from(blockNumber)
  const bigBlockTimestamp = BigNumber.from(blockTimestamp)
  const bigStartBlock = BigNumber.from(proposal.startBlock)
  const bigEndBlock = BigNumber.from(proposal.endBlock)
  const bigAgreeVotes = BigNumber.from(proposal.agreeVotes)
  const bigAgainstVotes = BigNumber.from(proposal.againstVotes)
  const bigQuorumVotes = BigNumber.from(proposal.quorumVotes)
  const bigETA = BigNumber.from(proposal.eta)

  if (proposal.canceled) {
    return ProposalState.Canceled
  }
  if (bigBlockNumber.lte(bigStartBlock)) {
    return ProposalState.Pending
  }
  if (bigBlockNumber.lte(bigEndBlock)) {
    return ProposalState.Active
  }
  if (bigAgreeVotes.lte(bigAgainstVotes) || bigQuorumVotes.gt(bigAgreeVotes)) {
    return ProposalState.Defeated
  }
  if (bigETA.eq(0)) {
    return ProposalState.Succeeded
  }
  if (proposal.executed) {
    return ProposalState.Executed
  }
  if (
    bigBlockTimestamp.gte(
      BigNumber.from(proposal.eta).add(TIMELOCK_GRACE_PERIOD),
    )
  ) {
    return ProposalState.Expired
  }
  return ProposalState.Queued
}

export const useProposalState = (proposal: GovernorProposal) => {
  const { data: blockNumber } = useBlockNumber()
  const provider = useProvider()
  const [state, setState] = useState<ProposalState>()

  useEffect(() => {
    if (!blockNumber || !provider) {
      return
    }

    ;(async () => {
      const { timestamp } = await provider.getBlock(blockNumber)
      const newestState = await getProposalState(
        proposal,
        blockNumber,
        timestamp,
      )
      setState(newestState)
    })()
  }, [blockNumber, proposal, provider])

  return state
}
