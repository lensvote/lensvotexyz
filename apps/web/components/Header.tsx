import { Logo } from "./Logo"

export const Header = () => {
  return (
    <div className="relative bg-white shadow-[0_4px_12px_-2px_rgba(39,30,7,0.04),0_3px_3px_-2px_rgba(39,30,7,0.03),0_1px_2px_-4px_rgba(39,30,7,0.02)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-6 sm:px-6 md:justify-start md:space-x-10">
        <div className="flex justify-start lg:w-0 lg:flex-1">
          <a href="#">
            <span className="sr-only">LensVote</span>
            <Logo />
          </a>
        </div>
      </div>
    </div>
  )
}
