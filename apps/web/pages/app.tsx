import ProfileCard from "@components/ProfileCard"
import Follow from "@components/shared/Follow"
import Unfollow from "@components/shared/Unfollow"
import { Card } from "@components/UI/Card"
import { useAppStore } from "@store/app"

const AppPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile)!

  return (
    <div className="bg-[#F4F5F6] p-8 h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
          <ProfileCard className="col-span-1" />
          <Card className="col-span-2">
            <div className="flex flex-col p-4">
              <h2>Follow someone</h2>

              <div>
                {!currentProfile?.isFollowedByMe ? (
                  <Follow
                    profile={currentProfile}
                    setFollowing={console.log}
                    showText
                  />
                ) : (
                  <Unfollow
                    profile={currentProfile}
                    setFollowing={console.log}
                    showText
                  />
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AppPage
