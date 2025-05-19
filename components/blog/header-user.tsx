import { formatLongDate } from "@/utils/date-format"
import PostTypeTag from "../post/post-type-tag"
import { UserAvatar } from "../ui/user-avatar"
import { HeaderUserProps } from "@/types/header-user-props"
const HeaderUser = ({user, routeUserProfile, post}: HeaderUserProps) => {
    return(
         <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-9 flex-wrap">
      <div className="flex  sm:items-center gap-2">
        <UserAvatar user={user} size="lg"/>
        <div
          onClick={routeUserProfile}
          className="font-bold text-lg cursor-pointer"
        >
          {post.userFullName}
        </div>
      </div>

      <p className="text-md text-gray-600">{formatLongDate(post.publicationDate)}</p>

      <div className="self-start flex items-center md:self-auto">
        <PostTypeTag post={post.postType} />
      </div>
    </div>
    )
}
export default HeaderUser