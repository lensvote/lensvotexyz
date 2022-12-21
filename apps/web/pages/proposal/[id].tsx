import React from "react"
import { useRouter } from "next/router"
import ProposalCard from "@components/app/ProposalCard"
import VoteCard from "@components/proposal/VoteCard"
import { useUserGovernor } from "@lib/hooks/useGovernorContract"
import ExtraActionsCard from "@components/proposal/ExtraActionsCard"
import ProposalDetailCard from "@components/proposal/ProposalDetailCard"

const ProposalDetail = () => {
  const { query } = useRouter()
  // TODO: use id to get a proposal detail, we're now unable to do it because of unfinished graphql api
  const { id } = query

  const { latestProposal: userProposal } = useUserGovernor()

  // TODO: Return skeleton
  if (!userProposal) {
    return <div className="bg-[#F4F5F6] h-[80vh] p-3" />
  }

  return (
    <div className="bg-[#F4F5F6] h-[80vh] p-3">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
          <div className="col-span-2 space-y-4">
            <ProposalCard proposal={userProposal} />

            <VoteCard />
          </div>
          <div className="col-span-1 space-y-4">
            <ProposalDetailCard proposal={userProposal} />
            <ExtraActionsCard id={userProposal.id} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProposalDetail
