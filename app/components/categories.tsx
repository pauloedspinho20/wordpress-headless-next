import { Badge } from "./ui/badge";

export default function Categories({ categories }: any) {
  return (
    <span className="ml-1 text-sm">
      {categories.length > 0 &&
        categories.map((category: any, index: any) => (
          <Badge variant="outline" key={index} className="ml-1">
            {category.name}
          </Badge>
        ))}
    </span>
  );
}
