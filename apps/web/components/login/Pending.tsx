import { Button } from "@components/UI/Button"
import { Spinner } from "@components/UI/Spinner"
import { ArrowRightIcon } from "@heroicons/react/24/outline"
import { useHasTxHashBeenIndexedQuery } from "lens"
import type { FC } from "react"

interface Props {
  txHash: string
  onNext: () => void
}

const Pending: FC<Props> = ({ txHash, onNext }) => {
  const { data, loading } = useHasTxHashBeenIndexedQuery({
    variables: { request: { txHash } },
    pollInterval: 1000,
  })

  return (
    <div className="p-5 font-bold text-center">
      {loading ||
      (data?.hasTxHashBeenIndexed.__typename === "TransactionIndexedResult" &&
        !data?.hasTxHashBeenIndexed.indexed) ? (
        <div className="space-y-3">
          <Spinner className="mx-auto" variant="secondary" />
          <div>Account creation in progress, please wait!</div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-[40px]">🌿</div>
          <div>Account created successfully</div>
          <div className="pt-3">
            <Button
              className="mx-auto"
              icon={<ArrowRightIcon className="mr-1 w-4 h-4" />}
              onClick={() => onNext()}
            >
              Go to profile
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Pending
