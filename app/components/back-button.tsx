import { ReactNode } from "react";
import { useRouter } from "next/router";
import { ChevronLeftIcon } from "lucide-react";
import { Button } from "./ui/button";

interface Props {
  className?: string;
  children?: ReactNode;
}
const BackButton = ({ className, children }: Props) => {
  const router = useRouter();

  const handleClick = () => {
    router.back();
  };

  return (
    <Button size="sm" className={className} onClick={handleClick}>
      {children ? children : <ChevronLeftIcon />}
    </Button>
  );
};

export default BackButton;
