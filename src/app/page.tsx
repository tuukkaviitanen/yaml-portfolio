import { getConfiguration } from "@/utils/configuration";
import { Metadata } from "next";
import Image from "next/image";

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
  const { links, projects, description, image_url, name } =
    await configurationPromise;
  return (
    <main>
      <header>
        <h1>Portfolio</h1>
      </header>
      <div className="container">
        <div className="profile">
          {image_url && (
            <Image
              src={image_url}
              height={600}
              alt="profile image"
              width={200}
            />
          )}
          <h2>About Me</h2>
          <h3>{name}</h3>
          <p>{description}</p>
        </div>
        <h2>Links</h2>
        <div className="links">
          {links?.map((link) => (
            <li key={link.id}>
              <a href={link.url}>
                {link.icon_url && (
                  <Image
                    src={link.icon_url}
                    alt={`link icon for ${link.name}`}
                    height={20}
                    width={20}
                  />
                )}
                {link.name}
              </a>
            </li>
          ))}
        </div>
        <div className="projects">
          <h2>Projects</h2>
          {projects?.map((project) => (
            <div key={project.id} className="project">
              {project.image_url && (
                <Image
                  src={project.image_url}
                  alt={`project image for ${project.name}`}
                  height={64}
                  width={64}
                />
              )}
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <Link url={project.url} />
              <Link url={project.github_repository_url} />
              <h4>Languages</h4>
              {project.languages?.map((language) => (
                <li key={language}>{language}</li>
              ))}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

const Link = ({ url }: { url?: string }) =>
  url && (
    <li>
      <a href={url}>{url}</a>
    </li>
  );
