import type { PopulatedLink } from "../utils/types";
import Link from "./Link";
import { SecondaryTitle } from "./Typography";

type LinksProps = {
  links: PopulatedLink[];
};

export default function Links({ links }: LinksProps) {
  return (
    <>
      <SecondaryTitle>Links</SecondaryTitle>
      <ul className="links grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {links?.map((link) => (
          <li
            key={link.id}
            className="bg-white shadow-md hover:shadow-2xl rounded-lg p-4 flex items-center space-x-4 dark:bg-secondary transition-all duration-300 ease-in-out"
          >
            {link.icon_url && (
              <img
                loading="lazy"
                alt={`Link icon for ${link.name}`}
                src={link.icon_url}
                height={20}
                width={20}
                className="rounded"
              />
            )}
            <Link name={link.name} url={link.url} />
          </li>
        ))}
      </ul>
    </>
  );
}
