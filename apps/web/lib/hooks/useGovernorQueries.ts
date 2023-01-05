import * as Apollo from "@apollo/client"
import { gql, QueryHookOptions } from "@apollo/client"

const HomeProposalsDocument = gql`
  query HomeProposals {
    governorProposals {
      id
      proposer {
        id
      }
      gov {
        id
        profileId
      }
      agreeVotes
      againstVotes
      abstainVotes
      status
      description
      startBlock
      endBlock
      eta
      quorumVotes
      targets
      values
      signatures
      calldatas
    }
  }
`

const lensvoteGraphOptions: QueryHookOptions = {
  context: {
    clientName: "lensvote-client",
  },
}

export function useHomeProposalsQuery(baseOptions?: Apollo.QueryHookOptions) {
  const options = { ...lensvoteGraphOptions, ...baseOptions }
  return Apollo.useQuery(HomeProposalsDocument, options)
}

const ProposalDocument = gql`
  query Proposal($id: String!) {
    governorProposal(id: $id) {
      id
      proposer {
        id
      }
      gov {
        id
        profileId
      }
      agreeVotes
      againstVotes
      abstainVotes
      status
      description
      startBlock
      endBlock
      eta
      quorumVotes
      targets
      values
      signatures
      calldatas
    }
  }
`

export function useProposalQuery(baseOptions?: Apollo.QueryHookOptions) {
  const options = { ...lensvoteGraphOptions, ...baseOptions }
  return Apollo.useQuery(ProposalDocument, options)
}
