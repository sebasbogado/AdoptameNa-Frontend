import Image from "next/image";
import ForwardRefEditor from "../editor/forward-ref-editor";
import { BlogContentProps } from "@/types/props/blogs/blog-content-props";
import PostSidebar from "../post/post-sidebar";
const notFoundSrc = "/logo.png"; // Default image source

const BlogContent = ({ post, blogContent }: BlogContentProps) => {
  return (
    <>
      <div className="flex justify-center">
        <h1 className="text-4xl font-bold text-gray-900">{post?.title}</h1>
      </div>

      {post?.media && post.media.length !== 0 && (
        <div className="w-full max-w-4xl mx-auto mb-4">
          <Image
            src={post.media[0]?.url || notFoundSrc}
            alt="Imagen principal del post"
            className="w-full h-auto object-cover rounded-lg"
            width={1920}
            height={500}
            priority
          />
        </div>
      )}

      <div className="flex justify-center">
        <div className="w-full max-w-4xl">
          <ForwardRefEditor markdown={blogContent} readOnly />
        </div>
      </div>
     

    </>
  );
};
export default BlogContent;