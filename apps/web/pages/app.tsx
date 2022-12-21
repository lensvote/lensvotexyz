// import GovernanceScrollList from "@components/app/GovernorList"
import ProfileCard from "@components/app/ProfileCard"
import ProposalFeed from "@components/app/ProposalFeed"
import { useAppStore } from "@store/app"

const AppPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile)!

  return (
    <div className="bg-[#F4F5F6] p-8 h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
          <ProfileCard className="col-span-1" profile={currentProfile} />

          <div className="col-span-2 space-y-4">
            {/* <GovernanceScrollList className="col-span-2" /> */}
            <ProposalFeed />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppPage
