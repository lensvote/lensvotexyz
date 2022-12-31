import React, { ChangeEventHandler, useState } from "react"
import { Address, useContract, useSigner } from "wagmi"
import { isAddress } from "ethers/lib/utils.js"
import { Button } from "@components/UI/Button"
import { Spinner } from "@components/UI/Spinner"
import { FollowNFT } from "abis"

type DelegationProps = {
  delegateTo?: Address
  followNFTAddress: Address
}

const Delegation = ({ delegateTo, followNFTAddress }: DelegationProps) => {
  const [loading, setLoading] = useState(false)
  const [delegateAddress, setDelegateAddress] = useState<string | undefined>(
    delegateTo,
  )
  const { data: signer } = useSigner()
  const followNftContract = useContract({
    abi: FollowNFT,
    address: followNFTAddress,
    signerOrProvider: signer,
  })

  const handleDelegate = async () => {
    if (!delegateAddress || !isAddress(delegateAddress) || !followNftContract) {
      return
    }

    try {
      setLoading(true)
      const tx = await followNftContract.delegate(delegateAddress)
      await tx.wait()
    } catch {
      //
    } finally {
      setLoading(false)
    }
  }

  const handleDelegationAddressChange: ChangeEventHandler<HTMLInputElement> = (
    evt,
  ) => {
    setDelegateAddress(evt.target.value)
  }

  return (
    <div className="p-5">
      <div className="space-y-1">
        <label htmlFor="handle" className="block font-medium">
          Delegation Address
        </label>
        <input
          type="text"
          placeholder="0x..."
          required
          className="block w-full max-w-lg rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 sm:max-w-xs sm:text-sm"
          value={delegateAddress}
          onChange={handleDelegationAddressChange}
        />
      </div>
      <p className="font-normal text-sm mt-4">
        The default is the personal wallet address, which can be manually
        modified to other addresses
      </p>

      <Button
        className="mt-6"
        size="sm"
        type="submit"
        disabled={loading}
        icon={loading && <Spinner size="xs" />}
        onClick={handleDelegate}
      >
        Delegate
      </Button>
    </div>
  )
}

export default Delegation
