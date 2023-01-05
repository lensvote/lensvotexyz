import React from "react"
import { useRouter } from "next/router"
import ProposalCard from "@components/app/ProposalCard"
import VoteCard from "@components/proposal/VoteCard"
import {
  GovernorProposal,
  ProposalActions,
  useUserGovernor,
} from "@lib/hooks/useGovernorContract"
import ExtraActionsCard from "@components/proposal/ExtraActionsCard"
import ProposalDetailCard from "@components/proposal/ProposalDetailCard"
import { useProposalQuery } from "@lib/hooks/useGovernorQueries"

const ProposalDetail = () => {
  const { query } = useRouter()
  // TODO: use id to get a proposal detail, we're now unable to do it because of unfinished graphql api
  const { id } = query

  const { data } = useProposalQuery({
    variables: { id },
  })
  const proposal = data?.governorProposal as GovernorProposal

  // const { latestProposal: userProposal, latestProposalActions } =
  // useUserGovernor()

  // TODO: Return skeleton
  if (!proposal) {
    return <div className="bg-[#F4F5F6] h-[80vh] p-3" />
  }

  const [voteId] = proposal.id.toString().split("|")
  const actions: ProposalActions = [
    proposal.targets,
    proposal.values,
    proposal.signatures,
    proposal.calldatas,
  ]

  return (
    <div className="bg-[#F4F5F6] h-[80vh] p-3">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
          <div className="col-span-2 space-y-4">
            <ProposalCard proposal={proposal} />
            <VoteCard proposal={proposal} />
          </div>
          <div className="col-span-1 space-y-4">
            <ProposalDetailCard proposal={proposal} actions={actions} />
            <ExtraActionsCard id={voteId.toString()} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProposalDetail
