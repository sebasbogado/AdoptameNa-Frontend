import { PostType } from "@/types/post-type";

const getColorByPostType = (type: string): string => {
    switch (type.toLowerCase()) {
        case "blog":
            return "bg-blog";
        case "volunteering":
            return "bg-volunteering";
        default:
            return "bg-gray-200";
    }
};

const PostTypeTag = ({ post }: { post: PostType }) => {
    const postTypeName = post.name
    const color = getColorByPostType(postTypeName);

    return (
        <div className="flex items-center gap-2">
            <div className={`w-auto flex items-center p-5 h-4 rounded-full ${color}`} >
            <p className="text-md font-medium text-white">{postTypeName}</p>
            </div>
        </div>
    );
};

export default PostTypeTag;