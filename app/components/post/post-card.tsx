import { stripHtml } from "string-strip-html";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Date from "../date";

import { IPost } from "@/types/posts";

interface Props {
  post: IPost;
}

export default function PostCard({ post }: Props) {
  return (
    <Card key={post.id} className="overflow-hidden md:break-inside-avoid">
      <Link href={`/posts/${post.slug}`}>
        <div className="max-h-44 overflow-hidden">
          <Image
            className="max-h-44 w-full object-cover transition hover:scale-110"
            alt={post.title}
            src={post.featuredImage?.sourceUrl}
            height={parseFloat(post.featuredImage?.mediaDetails?.height)}
            width={parseFloat(post.featuredImage?.mediaDetails?.width)}
          />
        </div>
      </Link>
      <CardHeader className="relative flex flex-row items-center gap-4 pb-2">
        <div className="flex flex-col">
          <Link href={`/posts/${post.slug}`}>
            <CardTitle className="text-lg transition hover:text-primary">
              {post.title}
            </CardTitle>
          </Link>
        </div>
      </CardHeader>

      <CardContent>
        <CardDescription>{stripHtml(post.excerpt).result}</CardDescription>
        <div className="flex items-center gap-2">
          <small>{post.author.name} -</small>
          <Date className="text-xs" dateString={post.date || ""} />
        </div>
      </CardContent>
    </Card>
  );
}
