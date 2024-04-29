import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Head from "next/head";
import { GetStaticPaths, GetStaticProps } from "next";

import Container from "@/components/container";
import PostBody from "@/components/post/post-body";
import MorePosts from "@/components/post/more-posts";
import AsideMenu from "@/components/layout/aside-munu";
import PostHeader from "@/components/post/post-header";
import SectionSeparator from "@/components/section-separator";
import Layout from "@/components/layout";
import ScrollToTop from "@/components/scroll-to-top";
import Tags from "@/components/tags";

import {
  getAllPostsWithSlug,
  getPostAndMorePosts,
} from "@/wp-api/queries/posts";
import { CMS_NAME } from "@/lib/constants";
import { IPost } from "@/types/posts";

interface Props {
  post: IPost;
  posts: IPost[];
  preview: boolean;
}

export default function Post({ post, posts, preview }: Props) {
  const router = useRouter();

  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <Layout preview={preview}>
      <AsideMenu />
      {router.isFallback ? (
        <div>Loading…</div>
      ) : (
        <div className="flex flex-col sm:gap-4 sm:pb-4 sm:pl-14">
          <article>
            <Head>
              <title>
                {`${post.title} | Next.js Blog Example with ${CMS_NAME}`}
              </title>
              <meta
                property="og:image"
                content={post.featuredImage?.sourceUrl}
              />
            </Head>
            <PostHeader
              title={post.title}
              coverImage={post.featuredImage}
              date={post.date}
              author={post.author}
              categories={post.categories}
            />
            <Container>
              <PostBody className="mt-5" content={post.content} />
              <footer>
                {post?.tags?.length > 0 && <Tags tags={post.tags} />}
              </footer>
            </Container>
          </article>
          <Container>
            <SectionSeparator />
            {posts?.length > 0 && <MorePosts posts={posts} />}
          </Container>
        </div>
      )}
      <ScrollToTop />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false,
  previewData,
}) => {
  const data = await getPostAndMorePosts(params?.slug, preview, previewData);

  return {
    props: {
      preview,
      post: data?.post,
      posts: data?.posts,
    },
    revalidate: 10,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const allPosts = await getAllPostsWithSlug();

  return {
    paths: allPosts.edges.map(({ node }: any) => `/posts/${node.slug}`) || [],
    fallback: true,
  };
};
