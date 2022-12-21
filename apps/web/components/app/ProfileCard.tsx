import React, { PropsWithChildren } from "react"
import clsx, { ClassValue } from "clsx"
import {
  DocumentDuplicateIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline"
import { RxDiscordLogo, RxTwitterLogo, RxGithubLogo } from "react-icons/rx"
import { TbBrandTelegram } from "react-icons/tb"
import { formatNumber } from "@lib/formats"
import Jazzicon, { jsNumberForAddress } from "react-jazzicon"

import { Card } from "../UI/Card"
import { Button } from "../UI/Button"

import { NextLink } from "@components/common/NextLink"
import { HANDLE_SUFFIX, ZERO_ADDRESS } from "@data/constants"
import { Profile } from "lens"

type ProfileCardProps = {
  className: ClassValue
  profile?: Profile
}

const stats = [
  {
    name: "following",
    value: 431,
  },
  {
    name: "followers",
    value: 227213,
  },
  {
    name: "vote",
    value: 431,
  },
]

const iconMap = {
  mail: <EnvelopeIcon className="h-6 w-6" />,
  discord: <RxDiscordLogo className="h-6 w-6" />,
  twitter: <RxTwitterLogo className="h-6 w-6" />,
  telegram: <TbBrandTelegram className="h-6 w-6" />,
  github: <RxGithubLogo className="h-5 w-5" />,
} as const

type Media = {
  icon: keyof typeof iconMap
  link?: string
}

const medias: Media[] = [
  { icon: "mail", link: "" },
  { icon: "discord", link: "" },
  { icon: "twitter", link: "" },
  { icon: "telegram", link: "" },
  { icon: "github", link: "" },
]

const formatHandle = (handle?: string | null, keepSuffix = false) => {
  if (!handle) {
    return ""
  }

  if (handle?.toLowerCase() === "lensprotocol") {
    return handle
  }

  if (keepSuffix) {
    return handle + HANDLE_SUFFIX
  }

  return handle.replace(HANDLE_SUFFIX, "")
}

const formatAddress = (address?: string) => {
  if (!address) {
    return ""
  }

  return `${address.slice(0, 4)}...${address.slice(-4)}`
}

const ProfileCard = ({
  profile,
  className,
}: PropsWithChildren<ProfileCardProps>) => {
  const avatarUri =
    (profile?.picture as any)?.original?.url ?? (profile?.picture as any)?.uri

  return (
    <Card className={clsx("p-6 flex flex-col gap-4", className)}>
      {/* avatar and name */}
      <div className="flex flex-shrink-0">
        <div className="flex items-center">
          <div>
            {avatarUri ? (
              <img
                className="inline-block h-16 w-16 rounded-full"
                src={avatarUri}
                alt={formatHandle(profile?.handle)}
              />
            ) : (
              <Jazzicon
                diameter={64}
                seed={jsNumberForAddress(profile?.ownedBy ?? ZERO_ADDRESS)}
              />
            )}
          </div>
          <div className="ml-3 space-y-1">
            <p className="text-sm font-medium">
              {profile?.name ?? formatHandle(profile?.handle)}
            </p>
            <Button
              className="text-xs font-light text-[#626469] px-1"
              icon={<DocumentDuplicateIcon className="w-4 h-4" />}
              size="sm"
              outline
            >
              {formatAddress(profile?.ownedBy)}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      {profile?.stats && (
        <dl className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="justify-self-center">
            <dt className="text-xs font-medium">
              {formatNumber(profile.stats.totalFollowing, { compact: true })}
            </dt>
            <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
              <div className="flex items-baseline text-[#A8AAAD] text-xs font-medium capitalize">
                Following
              </div>
            </dd>
          </div>

          <div className="justify-self-center">
            <dt className="text-xs font-medium">
              {formatNumber(profile.stats.totalFollowers, { compact: true })}
            </dt>
            <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
              <div className="flex items-baseline text-[#A8AAAD] text-xs font-medium capitalize">
                Followers
              </div>
            </dd>
          </div>

          {/* TODO: Total Vote */}
          {/* <div className="justify-self-center">
            <dt className="text-xs font-medium">
              {formatNumber(vote, { compact: true })}
            </dt>
            <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
              <div className="flex items-baseline text-[#A8AAAD] text-xs font-medium capitalize">
                Votes
              </div>
            </dd>
          </div> */}
        </dl>
      )}

      {/* Media list */}
      {/* <div className="flex gap-2 mt-2 mb-4">
        {medias.map((media) => (
          <a
            className="p-1 flex justify-center items-center"
            key={media.link}
            href={media.link}
            target="_blank"
            rel="noreferrer"
          >
            {iconMap[media.icon] ?? ""}
          </a>
        ))}
      </div> */}

      {/* Poll button */}
      <NextLink href="/create-proposal">
        <Button className="flex justify-center w-48" rounded>
          Poll
        </Button>
      </NextLink>
    </Card>
  )
}

export default ProfileCard
