import cn from "classnames";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import PostCard from "../post/post-card";

import { IPost } from "@/types/posts";

export default function Posts(edges: any) {
  const { posts } = edges;

  return (
    <section id="testimonials" className="container py-24 sm:py-32">
      <h2 className="text-3xl font-bold md:text-4xl">
        Recent posts from Wordpress API
      </h2>

      <p className="pb-8 pt-4 text-xl text-muted-foreground">
        These posts are fetched with GraphQL
      </p>

      <div className="mx-auto mb-20 grid columns-2 space-y-4 sm:block md:grid-cols-2 lg:columns-3 lg:grid-cols-4 lg:gap-6 lg:space-y-6">
        {posts?.length > 0 ? (
          posts?.map((post: IPost) => <PostCard post={post} />)
        ) : (
          <div>No posts</div>
        )}
      </div>

      <div className="flex justify-center">
        <Link
          className={cn(
            "h-16 w-full text-xl md:w-1/3",
            buttonVariants({ size: "xl", variant: "secondary" }),
          )}
          href="/posts"
        >
          All Posts
        </Link>
      </div>
    </section>
  );
}
