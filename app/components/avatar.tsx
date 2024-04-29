import Image from "next/image";
import cn from "classnames";

interface Props {
  className?: string;
  author: any;
}

export default function Avatar({ className, author }: Props) {
  const isAuthorHaveFullName = author?.firstName && author?.lastName;
  const name = isAuthorHaveFullName
    ? `${author.firstName} ${author.lastName}`
    : author.name || null;

  return (
    <div className={cn("flex items-center", className)}>
      <div className="relative mr-4 h-[36px] w-[36px]">
        <Image
          src={author.avatar.url}
          layout="fill"
          className="rounded-full"
          alt={name}
        />
      </div>
      <div className="text-sm">{name}</div>
    </div>
  );
}
