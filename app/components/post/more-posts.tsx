import cn from "classnames";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import PostCard from "./post-card";

import { IPost } from "@/types/posts";

interface Props {
  posts: IPost[];
}
export default function MorePosts({ posts }: Props) {
  return (
    <section className="mb-10">
      <h2 className="mb-8 text-2xl font-bold leading-tight tracking-tighter md:text-4xl">
        More Posts
      </h2>{" "}
      <div className="mb-10 flex flex-col gap-5 md:flex-row">
        {posts.map((post: any) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      <div className="flex justify-end">
        <Link
          className={cn(buttonVariants({ size: "xl", variant: "outline" }))}
          href="/posts"
        >
          All Posts
        </Link>
      </div>
    </section>
  );
}
