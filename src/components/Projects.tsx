import { PopulatedConfiguration } from "@/utils/configuration";
import Link from "./Link";
import { QuaternaryTitle, TertiaryTitle, Text } from "./Typography";

type ProjectsProps = {
  projects: PopulatedConfiguration["projects"];
};

export default function Projects({ projects }: ProjectsProps) {
  return (
    <div className="projects mt-8">
      <h2 className="text-2xl font-semibold mb-4">Projects</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.map((project) => (
          <Project key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

const Project = ({
  project,
}: {
  project: PopulatedConfiguration["projects"][0];
}) => {
  return (
    <div
      key={project.id}
      className="project bg-white shadow-md rounded-lg p-6 dark:bg-gray-700 dark:shadow-lg"
    >
      {project.image_url && (
        <img
          src={project.image_url}
          height={128}
          width={128}
          className="rounded mb-4 mx-auto"
        />
      )}
      <TertiaryTitle>{project.name}</TertiaryTitle>
      <Text>{project.description}</Text>
      <ul className="space-y-2">
        <ProjectLink title="Project Page" link={project.url} />
        <ProjectLink
          title="GitHub Repository"
          link={project.github_repository_url}
        />
      </ul>
      <List title="Languages" list={project.languages} />
      <List title="Technologies" list={project.technologies} />
    </div>
  );
};

const ProjectLink = ({ title, link }: { title: string; link?: string }) =>
  link && (
    <>
      <QuaternaryTitle>{title}</QuaternaryTitle>
      <Link url={link} />
    </>
  );

const List = ({ title, list }: { title: string; list?: string[] }) =>
  list?.length && (
    <>
      <QuaternaryTitle>{title}</QuaternaryTitle>
      <ul className="flex flex-wrap gap-2 mt-4">
        {list?.map((item) => (
          <li
            key={item}
            className="bg-gray-200 dark:bg-gray-600 text-sm px-3 py-1 rounded-full"
          >
            <span className="text-gray-800 dark:text-gray-200">{item}</span>
          </li>
        ))}
      </ul>
    </>
  );
