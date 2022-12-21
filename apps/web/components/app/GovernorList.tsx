import React, { useState } from "react"
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu"
import clsx, { ClassValue } from "clsx"
import { Card } from "@components/UI/Card"

type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>

const ITEMS = [
  {
    id: 0,
    name: "My latest proposal",
    icon: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <circle cx="26" cy="26" r="25.5" stroke="#61C152" />
        <circle opacity="0.2" cx="26" cy="26" r="22" fill="#61C152" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M26.3609 27L25.376 32.9096L31.0885 25H25.6391L26.624 19.0904L20.9115 27H26.3609ZM29.2984 15.2096C29.4722 14.167 28.1202 13.6028 27.5013 14.4597L18.1451 27.4145C17.6675 28.0758 18.14 29 18.9558 29H24L22.7016 36.7904C22.5278 37.8331 23.8798 38.3972 24.4987 37.5403L33.8549 24.5855C34.3326 23.9242 33.86 23 33.0442 23H28L29.2984 15.2096Z"
          fill="#61C152"
        />
      </svg>
    ),
  },
  // {
  //   id: 1,
  //   name: "stargate DAO",
  // },
]

function onWheel(apiObj: scrollVisibilityApiType, ev: React.WheelEvent): void {
  const isThouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15

  if (isThouchpad) {
    ev.stopPropagation()
    return
  }

  if (ev.deltaY < 0) {
    apiObj.scrollNext()
  } else if (ev.deltaY > 0) {
    apiObj.scrollPrev()
  }
}

type GovernanceListProps = {
  className: ClassValue
}

const GovernanceList = ({ className }: GovernanceListProps) => {
  const [items] = React.useState(ITEMS)
  const [selectedItemId, setSelectedItemId] = useState(items[0].id)

  const onItemClick = (id: number) => {
    setSelectedItemId(id)
  }

  return (
    <Card className={clsx("p-4", className)}>
      <ScrollMenu
        // LeftArrow={LeftArrow}
        // RightArrow={RightArrow}
        onWheel={onWheel}
        scrollContainerClassName="space-x-1"
      >
        {items.map(({ id, icon, name }) => (
          <div
            key={id}
            className={clsx(
              "flex flex-col items-center justify-center space-y-2 cursor-pointer w-24 p-2 text-center",
              selectedItemId === id ? "text-[#61C152]" : "text-[#61666D]",
            )}
            onClick={() => onItemClick(id)}
          >
            <div className="flex justify-center items-center flex-1">
              {icon ? (
                <div className="w-12 h-12">{icon}</div>
              ) : (
                <div className="rounded-full w-12 h-12 overflow-hidden bg-gray-200">
                  placeholder icon
                </div>
              )}
            </div>
            <p className="text-xs flex-1 place-self-center">{name}</p>
          </div>
        ))}
      </ScrollMenu>
    </Card>
  )
}

export default GovernanceList
