import { GetStaticProps } from "next";

import AsideMenu from "@/components/layout/aside-munu";
import Container from "@/components/container";
import Layout from "@/components/layout";
import PostCard from "@/components/post/post-card";
import ScrollToTop from "@/components/scroll-to-top";

import { getAllPosts } from "@/wp-api/queries/posts";
import { IPost } from "@/types/posts";

interface Props {
  post: IPost;
  posts: IPost[];
  preview: boolean;
}

export default function Post({ posts, preview }: Props) {
  return (
    <Layout preview={preview}>
      <AsideMenu />

      <div className="flex flex-col py-12 sm:gap-4 sm:py-10 sm:pl-14">
        <Container>
          <h1 className="mb-10">All posts</h1>
          <div className="mx-auto grid columns-2 space-y-4 sm:block md:grid-cols-2 lg:columns-3 lg:grid-cols-4 lg:gap-6 lg:space-y-6">
            {posts?.length > 0 ? (
              posts?.map((post: IPost) => <PostCard post={post} />)
            ) : (
              <div>No posts</div>
            )}
          </div>
        </Container>
      </div>
      <ScrollToTop />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const data = await getAllPosts();

  return {
    props: {
      posts: data,
    },
    revalidate: 10,
  };
};
