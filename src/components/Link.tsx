import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

export default function Link({ url, name }: { url?: string; name?: string }) {
  return (
    url && (
      <a
        target="_blank"
        href={url}
        className="text-blue-600 hover:underline break-words flex items-center space-x-2 dark:text-blue-400 relative group p-1"
        rel="noreferrer"
      >
        <div className="truncate">{name || url}</div>
        <ArrowTopRightOnSquareIcon className="h-4 w-4 flex-none" />
        <span className="absolute inset-0 rounded-md bg-accent/30 dark:bg-accent/30 opacity-0 group-hover:opacity-100 transition-opacity"></span>
      </a>
    )
  );
}
