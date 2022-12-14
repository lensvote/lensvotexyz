import type { ApolloCache } from "@apollo/client"
import { useBroadcastMutation } from "lens"

interface Props {
  onCompleted?: (data: any) => void
  update?: (cache: ApolloCache<any>) => void
}

const ERROR_MESSAGE =
  "A previous transaction may not been mined yet or you have passed in a invalid nonce. You must wait for that to be mined before doing another action, please try again in a few moments. Nonce out of sync."

const useBroadcast = ({
  onCompleted,
  update,
}: Props): { broadcast: any; data: any; loading: boolean } => {
  const [broadcast, { data, loading }] = useBroadcastMutation({
    onCompleted,
    update,
    onError: (error) => {
      if (error.message === ERROR_MESSAGE) {
        // TODO: Do something
        return
      }
    },
  })

  return {
    broadcast: ({ request }: any) => broadcast({ variables: { request } }),
    data,
    loading,
  }
}

export default useBroadcast
