import { parseISO, format } from "date-fns";

interface Props {
  className?: string;
  dateString: string;
}
export default function Date({ className, dateString }: Props) {
  const date = parseISO(dateString);
  return (
    <time className={className} dateTime={dateString}>
      {format(date, "LLLL	d, yyyy")}
    </time>
  );
}
