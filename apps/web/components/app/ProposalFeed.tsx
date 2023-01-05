import React from "react"
import { NextLink } from "@components/common/NextLink"
import { Card } from "@components/UI/Card"
import {
  GovernorProposal,
  // useUserGovernor,
} from "@lib/hooks/useGovernorContract"
import ProposalCard from "./ProposalCard"
import { useHomeProposalsQuery } from "@lib/hooks/useGovernorQueries"

const ProposalFeed = () => {
  // const { latestProposal } = useUserGovernor()
  const { data } = useHomeProposalsQuery()
  const proposals = data?.governorProposals

  return (
    <Card>
      {proposals?.map((proposal: GovernorProposal) => (
        <NextLink href={`/proposal/${proposal.id}`} key={proposal.id}>
          <ProposalCard proposal={proposal} displayVote />
        </NextLink>
      ))}
    </Card>
  )
}

export default ProposalFeed
