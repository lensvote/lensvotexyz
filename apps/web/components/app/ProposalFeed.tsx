import React, { Fragment } from "react"
import { NextLink } from "@components/common/NextLink"
import { Card } from "@components/UI/Card"
import { GovernorProposal } from "@lib/hooks/useGovernorContract"
import ProposalCard from "./ProposalCard"
import { useHomeProposalsQuery } from "@lib/hooks/useGovernorQueries"

const ProposalFeed = () => {
  const { data } = useHomeProposalsQuery()
  const proposals = data?.governorProposals

  return (
    <Card>
      {proposals?.map((proposal: GovernorProposal, index: number) => (
        <Fragment key={proposal.id}>
          <NextLink href={`/proposal/${proposal.id}`} key={proposal.id}>
            <ProposalCard proposal={proposal} displayVote />
          </NextLink>
          {index !== proposals.length - 1 && (
            <div className="h-[.5px] bg-[#C8C9CC]" />
          )}
        </Fragment>
      ))}
    </Card>
  )
}

export default ProposalFeed
