import cn from "classnames";
import Image from "next/image";
import Link from "next/link";

interface Props {
  title: string;
  className?: string;
  coverImage: {
    sourceUrl: string;
  };
  slug?: string;
}

export default function CoverImage({
  className,
  title,
  coverImage,
  slug,
}: Props) {
  const image = (
    <Image
      width={2000}
      height={300}
      alt={`Cover Image for ${title}`}
      src={coverImage?.sourceUrl}
      className={cn("shadow-small object-cover", className, {
        "hover:shadow-medium transition-shadow duration-200": slug,
      })}
    />
  );
  return slug ? (
    <Link href={`/posts/${slug}`} aria-label={title}>
      {image}
    </Link>
  ) : (
    image
  );
}
