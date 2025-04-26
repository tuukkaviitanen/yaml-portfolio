import type { PopulatedConfiguration } from "../utils/configuration";
import Link from "./Link";
import { SecondaryTitle } from "./Typography";

type LinksProps = {
  links: PopulatedConfiguration["links"];
};

export default function Links({ links }: LinksProps) {
  return (
    <>
      <SecondaryTitle>Links</SecondaryTitle>
      <ul className="links grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {links?.map((link) => (
          <li
            key={link.id}
            className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4 dark:bg-gray-700 dark:shadow-lg"
          >
            {link.icon_url && (
              <img
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
