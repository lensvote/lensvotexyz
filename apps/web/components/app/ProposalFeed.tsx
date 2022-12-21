import React from "react"
import { NextLink } from "@components/common/NextLink"
import { Card } from "@components/UI/Card"
import { useUserGovernor } from "@lib/hooks/useGovernorContract"
import ProposalCard from "./ProposalCard"

const ProposalFeed = () => {
  const { latestProposal } = useUserGovernor()

  return (
    <Card className="">
      {latestProposal && (
        <NextLink href={`/proposal/${latestProposal.id}`}>
          <ProposalCard proposal={latestProposal} displayVote />
        </NextLink>
      )}
    </Card>
  )
}

export default ProposalFeed
