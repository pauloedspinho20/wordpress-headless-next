import { fetchGraphQL, transformGraphQLResponse } from "../api";

import { ICategory, IPost } from "@/types/posts";
import { mockCategories } from "../mock";

/*
 * QUERIES - POSTS
 */

const categoryFields = `
  fragment CategoryFields on Category {
    databaseId
    id
    count
    name
    parent {
      node {
        databaseId
        id
        name
        slug
      }
    }
    slug
  }
`;

const authorFields = `
  fragment AuthorFields on User {
    databaseId
    id
    name
    firstName
    lastName
    avatar {
      url
    }
  }
`;

const postFields = `
  fragment PostFields on Post {
    databaseId
    id
    title
    slug
    content
    excerpt
    date
    status
    featuredImage {
      node {
        sourceUrl
        sizes
        mediaDetails {
          height
          width
        }
      }
    }
    author {
      node {
        ...AuthorFields
      }
    }
    categories {
      edges {
        node {
          id
          databaseId
          slug
          name
        }
      }
    }
    tags {
      edges {
        node {
          id
          databaseId
          slug
          name
        }
      }
    }
  }
`;

export async function getPreviewPost(id: number, idType = "DATABASE_ID") {
  const data = await fetchGraphQL(
    `
    ${postFields}

    query PreviewPost($id: ID!, $idType: PostIdType!) {
      post(id: $id, idType: $idType) {
        ...PostFields
      }
    }`,
    {
      variables: { id, idType },
    },
  );
  return data.post;
}

export async function getAllPostsWithSlug() {
  const data = await fetchGraphQL(`
    {
      posts(first: 20) {
        edges {
          node {
            slug
          }
        }
      }
    }
  `);
  return data?.posts;
}

export async function getAllPosts() {
  const data = await fetchGraphQL(
    `
    ${authorFields}
    ${postFields}

    query GetAllPosts {
      posts(first: 10000) {
        edges {
          node {
            ...PostFields
          }
        }
      }
    }
  `,
  );

  if (data) {
    return transformGraphQLResponse(data?.posts, "posts") as IPost;
  }

  return null;
}

export async function getAllPostsForHome(preview: boolean) {
  const data = await fetchGraphQL(
    `
    ${authorFields}
    ${postFields}
    
    query AllPosts {
      posts(first: 3, where: { orderby: { field: DATE, order: DESC } }) {
        edges {
          node {
            ...PostFields
          }
        }
      }
    }
  `,
    {
      variables: {
        onlyEnabled: !preview,
        preview,
      },
    },
  );

  if (data) {
    return transformGraphQLResponse(data?.posts, "posts") as IPost;
  }

  return null;
}

export async function getPostAndMorePosts(
  slug: string | undefined | string[],
  preview: boolean,
  previewData: any,
) {
  const postPreview = preview && previewData?.post;
  // The slug may be the id of an unpublished post
  const isId = Number.isInteger(Number(slug));
  const isSamePost = isId
    ? Number(slug) === postPreview.id
    : slug === postPreview.slug;
  const isDraft = isSamePost && postPreview?.status === "draft";
  const isRevision = isSamePost && postPreview?.status === "publish";
  const data = await fetchGraphQL(
    `
    ${authorFields}
    ${postFields}

    query PostBySlug($id: ID!, $idType: PostIdType!) {
      post(id: $id, idType: $idType) {
        ...PostFields
        content
        ${
          // Only some of the fields of a revision are considered as there are some inconsistencies
          isRevision
            ? `
        revisions(first: 1, where: { orderby: { field: MODIFIED, order: DESC } }) {
          edges {
            node {
              title
              excerpt
              content
              author {
                node {
                  ...AuthorFields
                }
              }
            }
          }
        }
        `
            : ""
        }
      }
      posts(first: 4, where: { orderby: { field: DATE, order: DESC } }) {
        edges {
          node {
            ...PostFields
          }
        }
      }
    }
  `,
    {
      variables: {
        id: isDraft ? postPreview.id : slug,
        idType: isDraft ? "DATABASE_ID" : "SLUG",
      },
    },
  );

  if (data) {
    const post = data?.post;

    // Draft posts may not have an slug
    if (isDraft) post.slug = postPreview.id;
    // Apply a revision (changes in a published post)
    if (isRevision && post.revisions) {
      const revision = post.revisions.edges[0]?.node;

      if (revision) Object.assign(post, revision);
      delete post.revisions;
    }

    // Filter out the main post
    const posts = data.posts?.edges?.filter(
      ({ node }: any) => node.slug !== slug,
    );
    const transformedPosts = transformGraphQLResponse(
      { edges: posts },
      "posts",
    );
    // If there are still 3 posts, remove the last one
    if (transformedPosts.length > 3) transformedPosts.pop();

    return {
      post: transformGraphQLResponse({ edges: [{ node: post }] }, "posts")?.[0],
      posts: transformedPosts,
    };
  }

  return null;
}

/* Get all categories */
export async function getCategories() {
  const data = await fetchGraphQL(
    `
    ${categoryFields}

    query Categories {
      categories(first: 10000) {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        nodes {
          ...CategoryFields
        }
      }
    }`,
  );

  if (data) {
    data?.categories?.nodes?.map(
      (category: ICategory) => (category.selected = false),
    );
    return data.categories.nodes as ICategory[];
  }
  /* Return mock categories when Wordpress API is not working */
  return mockCategories.categories.nodes as ICategory[];
}
