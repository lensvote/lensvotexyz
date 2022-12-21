import type { FC } from "react"
import { useSwitchNetwork } from "wagmi"
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline"
import { Button } from "@components/UI/Button"
import { CHAIN_ID } from "@data/constants"

interface Props {
  className?: string
}

const SwitchNetwork: FC<Props> = ({ className = "" }) => {
  const { switchNetwork } = useSwitchNetwork()

  return (
    <Button
      className={className}
      type="button"
      variant="danger"
      icon={<ArrowsRightLeftIcon className="w-4 h-4" />}
      onClick={() => {
        if (switchNetwork) {
          switchNetwork(CHAIN_ID)
        } else {
          // toast.error("Please change your network wallet!")
          return
        }
      }}
    >
      Switch Network
    </Button>
  )
}

export default SwitchNetwork
