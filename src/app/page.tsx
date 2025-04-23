import { getConfiguration } from "@/utils/configuration";
import { Metadata } from "next";
import Image from "next/image";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

const CONFIG_FILE_PATH = process.env.CONFIG_FILE_PATH || "portfolio.yaml";

const configurationPromise = getConfiguration(CONFIG_FILE_PATH);

export const metadata = async (): Promise<Metadata> => {
  const config = await configurationPromise;
  return {
    title: config.title || "Portfolio",
    description: config.description,
    icons: config.image_url,
  };
};

export default async function Home() {
  const { links, projects, description, image_url, name, title } =
    await configurationPromise;
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-800 dark:text-gray-100">
      <header className="bg-gray-900 text-white py-4 dark:bg-gray-700">
        <h1 className="text-center text-3xl font-bold">
          {title || "Portfolio"}
        </h1>
      </header>
      <div className="container mx-auto p-6">
        <div className="profile bg-white shadow-md rounded-lg p-6 mb-8 dark:bg-gray-700 dark:shadow-lg">
          {image_url && (
            <div className="flex justify-center mb-4">
              <Image
                src={image_url}
                height={200}
                alt="Profile image"
                width={200}
                className="rounded-full"
              />
            </div>
          )}
          <h2 className="text-2xl font-semibold text-center mb-2">About Me</h2>
          <h3 className="text-xl text-center text-gray-600 dark:text-gray-300">
            {name}
          </h3>
          <p className="text-center text-gray-700 dark:text-gray-400 mt-4">
            {description}
          </p>
        </div>
        <h2 className="text-2xl font-semibold mb-4">Links</h2>
        <ul className="links grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {links?.map((link) => (
            <li
              key={link.id}
              className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4 dark:bg-gray-700 dark:shadow-lg"
            >
              {link.icon_url && (
                <Image
                  src={link.icon_url}
                  alt={`Link icon for ${link.name}`}
                  height={20}
                  width={20}
                  className="rounded"
                />
              )}
              <a
                target="_blank"
                href={link.url}
                className="text-blue-600 hover:underline font-medium flex items-center space-x-2 dark:text-blue-400"
              >
                <span>{link.name}</span>
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              </a>
            </li>
          ))}
        </ul>
        <div className="projects mt-8">
          <h2 className="text-2xl font-semibold mb-4">Projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects?.map((project) => (
              <div
                key={project.id}
                className="project bg-white shadow-md rounded-lg p-6 dark:bg-gray-700 dark:shadow-lg"
              >
                {project.image_url && (
                  <Image
                    src={project.image_url}
                    alt={`Project image for ${project.name}`}
                    height={64}
                    width={64}
                    className="rounded mb-4"
                  />
                )}
                <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                <p className="text-gray-700 dark:text-gray-400 mb-4">
                  {project.description}
                </p>
                <ul className="space-y-2">
                  <Link url={project.url} />
                  <Link url={project.github_repository_url} />
                </ul>
                <h4 className="text-lg font-semibold mt-4">Languages</h4>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-400">
                  {project.languages?.map((language) => (
                    <li key={language}>{language}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

const Link = ({ url }: { url?: string }) =>
  url && (
    <li>
      <a
        target="_blank"
        href={url}
        className="text-blue-600 hover:underline break-words flex items-center space-x-2 dark:text-blue-400"
      >
        <span>{url}</span>
        <ArrowTopRightOnSquareIcon className="h-4 w-4" />
      </a>
    </li>
  );
