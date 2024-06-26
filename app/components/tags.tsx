export default function Tags({ tags }: any) {
  return (
    <div className="mx-auto max-w-2xl">
      <p className="mt-8 text-lg font-bold">
        Tagged
        {tags.edges.map((tag: any, index: any) => (
          <span key={index} className="ml-4 font-normal">
            {tag.node.name}
          </span>
        ))}
      </p>
    </div>
  );
}
