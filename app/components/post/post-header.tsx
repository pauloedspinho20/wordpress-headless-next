import Avatar from "../avatar";
import Date from "../date";
import CoverImage from "../cover-image";
import PostTitle from "./post-title";
import Categories from "../categories";
import BackButton from "../back-button";

export default function PostHeader({
  title,
  coverImage,
  date,
  author,
  categories,
}: any) {
  return (
    <>
      <div className="relative mb-12 h-screen sm:mx-0">
        <CoverImage
          className="absolute h-post-image w-full object-cover"
          title={title}
          coverImage={coverImage}
        />
        <div className="position-absolute w-full bg-gradient-to-t from-background from-10% to-transparent to-60%"></div>
        <div className="absolute top-10 w-full">
          <div className="container">
            <BackButton className=""></BackButton>
          </div>
        </div>
        <PostTitle className="absolute bottom-[100px] w-full text-center text-foreground">
          <div className="container">{title}</div>
        </PostTitle>
        <div className="absolute bottom-0 h-[66px] w-full p-2">
          <div className="container flex h-full items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar author={author} /> -
              <Date className="text-sm" dateString={date} />
            </div>
            <Categories categories={categories} />
          </div>
        </div>
      </div>
    </>
  );
}
