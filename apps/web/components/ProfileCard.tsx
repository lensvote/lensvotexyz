import React, { PropsWithChildren } from "react"
import clsx, { ClassValue } from "clsx"
import { formatNumber } from "@lib/formatNumber"
import { Card } from "./UI/Card"
import { Button } from "./UI/Button"
import {
  DocumentDuplicateIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline"
import { RxDiscordLogo, RxTwitterLogo, RxGithubLogo } from "react-icons/rx"
import { TbBrandTelegram } from "react-icons/tb"

type ProfileCardProps = {
  className: ClassValue
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

const ProfileCard = ({ className }: PropsWithChildren<ProfileCardProps>) => {
  return (
    <Card className={clsx("p-6 flex flex-col gap-4", className)}>
      {/* avatar and name */}
      <div className="flex flex-shrink-0">
        <div className="flex items-center">
          <div>
            <img
              className="inline-block h-12 w-12 rounded-full"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80"
              alt=""
            />
          </div>
          <div className="ml-3 space-y-1">
            <p className="text-sm font-medium">Tom Cook</p>
            <Button
              className="text-xs font-light text-[#626469] px-1"
              icon={<DocumentDuplicateIcon className="w-4 h-4" />}
              size="sm"
              outline
            >
              0x033...AB9c
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <dl className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((item) => (
          <div key={item.name} className="justify-self-center">
            <dt className="text-xs font-medium">
              {formatNumber(item.value, { compact: true })}
            </dt>
            <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
              <div className="flex items-baseline text-[#A8AAAD] text-xs font-medium capitalize">
                {item.name}
              </div>
            </dd>
          </div>
        ))}
      </dl>

      {/* Media list */}
      <div className="flex gap-2 mt-2 mb-4">
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
      </div>

      {/* Poll button */}
      <Button rounded>Poll</Button>
    </Card>
  )
}

export default ProfileCard
