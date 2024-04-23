import Avatar from "../avatar";
import Date from "../date";
import CoverImage from "../cover-image";
import Link from "next/link";

export default function PostPreview({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}: any) {
  return (
    <div>
      <div className="mb-5">
        {coverImage && (
          <CoverImage title={title} coverImage={coverImage} slug={slug} />
        )}
      </div>
      <h3 className="mb-3 text-3xl leading-snug">
        <Link
          href={`/posts/${slug}`}
          className="hover:underline"
          dangerouslySetInnerHTML={{ __html: title }}
        ></Link>
      </h3>
      <div className="mb-4 text-lg">
        <Date dateString={date} />
      </div>
      <div
        className="mb-4 text-lg leading-relaxed"
        dangerouslySetInnerHTML={{ __html: excerpt }}
      />
      <Avatar author={author} />
    </div>
  );
}
