import { getConfiguration } from "@/utils/configuration";
import { Metadata } from "next";
import Profile from "@/components/Profile";
import Links from "@/components/Links";
import Projects from "@/components/Projects";
import { PrimaryTitle } from "@/components/Typography";

export const dynamic = "force-dynamic"; // Forces SSR

const CONFIG_FILE_PATH = process.env.CONFIG_FILE_PATH || "portfolio.yaml";

export const metadata = async (): Promise<Metadata> => {
  const config = await getConfiguration(CONFIG_FILE_PATH);
  const title = config.title || "Portfolio";
  const name = config.name;

  const fullTitle = name ? `${title} | ${name}` : title;

  return {
    title: fullTitle,
    description: config.description,
    icons: config.image_url,
  };
};

export default async function Home() {
  const { links, projects, description, image_url, name, title } =
    await getConfiguration(CONFIG_FILE_PATH);
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-800 dark:text-gray-100 x-5">
      <header className="bg-gray-900 text-white py-4 dark:bg-gray-700">
        <PrimaryTitle>{title || "Portfolio"}</PrimaryTitle>
      </header>
      <div className="container mx-auto p-6">
        <Profile description={description} image_url={image_url} name={name} />
        <Links links={links} />
        <Projects projects={projects} />
      </div>
    </main>
  );
}
