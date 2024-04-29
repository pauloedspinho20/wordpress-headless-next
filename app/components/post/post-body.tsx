import cn from "classnames";
import styles from "./post-body.module.css";
import * as DOMPurify from "isomorphic-dompurify";

interface Props {
  className?: string;
  content: string;
}

export default function PostBody({ className, content }: Props) {
  return (
    <div className={cn("mx-auto", { className })}>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
      />
    </div>
  );
}
