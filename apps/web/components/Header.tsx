import { Button } from "./UI/Button"
import { NextLink } from "./common/NextLink"
import { Logo } from "./Logo"
import User from "./navbar/User"

type HeaderProps = {
  isLandingPage: boolean
}

export const Header = ({ isLandingPage }: HeaderProps) => {
  return (
    <div className="relative bg-white shadow-[0_4px_12px_-2px_rgba(39,30,7,0.04),0_3px_3px_-2px_rgba(39,30,7,0.03),0_1px_2px_-4px_rgba(39,30,7,0.02)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-6 sm:px-6 md:justify-start md:space-x-10">
        <NextLink href="/" className="flex justify-start lg:w-0 lg:flex-1 px-2 py-1">
          <span className="sr-only">LensVote</span>
          <Logo />
        </NextLink>
        {isLandingPage ? (
          <NextLink href="/app">
            <Button variant="success" rounded>
              Go To App
            </Button>
          </NextLink>
        ) : (
          <User />
        )}
      </div>
    </div>
  )
}
