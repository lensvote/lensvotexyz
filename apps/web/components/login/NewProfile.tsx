import type { FC } from "react"
import { useForm } from "react-hook-form"
import { Logo } from "@components/common/Logo"
import { Button } from "@components/UI/Button"
import { Spinner } from "@components/UI/Spinner"
import { APP_NAME } from "data/constants"
import { useCreateProfileMutation } from "lens"

import Pending from "./Pending"

interface NewProfileProps {
  isModal?: boolean
  onNext: () => void
}

type NewProfileFormData = {
  handle: string
}

const NewProfile: FC<NewProfileProps> = ({ isModal = false, onNext }) => {
  const [createProfile, { data, loading }] = useCreateProfileMutation()

  const form = useForm<NewProfileFormData>()
  const onSubmit = form.handleSubmit(({ handle }) => {
    const username = handle.toLowerCase()
    createProfile({
      variables: {
        request: {
          handle: username,
        },
      },
    })
  })

  return data?.createProfile.__typename === "RelayerResult" &&
    data?.createProfile.txHash ? (
    <Pending txHash={data?.createProfile?.txHash} onNext={onNext} />
  ) : (
    <form className="space-y-4" onSubmit={onSubmit}>
      {data?.createProfile.__typename === "RelayError" &&
        data?.createProfile.reason && (
          <div className="mb-3">Error on creating profile</div>
        )}
      {isModal && (
        <div className="mb-2 space-y-4">
          <Logo text={false} className="w-14 h-14" />
          <div className="text-xl font-bold">
            You need to get a Lens profile NFT on testnet before using{" "}
            {APP_NAME}
          </div>
        </div>
      )}
      <div className="space-y-1">
        <label
          htmlFor="handle"
          className="block text-xs font-medium text-gray-500"
        >
          Get a handle here (type your name)
        </label>
        <input
          type="text"
          placeholder="gavin"
          required
          className="block w-full max-w-lg rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 sm:max-w-xs sm:text-sm"
          {...form.register("handle")}
        />
      </div>
      <div className="flex justify-end">
        <Button
          className="ml-auto"
          size="sm"
          type="submit"
          disabled={loading}
          icon={loading && <Spinner size="xs" />}
        >
          Sign up
        </Button>
      </div>
    </form>
  )
}

export default NewProfile
