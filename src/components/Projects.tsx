import { useEffect, useRef, useState } from "react";
import Link from "./Link";
import { QuaternaryTitle, TertiaryTitle, Text } from "./Typography";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import type { PopulatedConfiguration, PopulatedProject } from "../utils/types";

const doesProjectMatchFilter = (
  project: PopulatedProject,
  filter: string
): boolean => {
  const filterLower = filter.toLowerCase();

  const filteredFields = [
    project.name,
    project.description,
    project.github_repository_url,
    project.url,
    project.github_repository,
    project.languages,
    project.technologies,
  ];

  const hasFoundMatch = filteredFields.some((field) => {
    if (Array.isArray(field)) {
      return field.some((item) => item.toLowerCase().includes(filterLower));
    } else {
      return field?.toLowerCase().includes(filterLower);
    }
  });

  return hasFoundMatch;
};

type ProjectsProps = {
  projects: PopulatedConfiguration["projects"];
};

export default function Projects({ projects }: ProjectsProps) {
  if (!projects?.length) {
    return null;
  }
  const [filter, setFilter] = useState("");

  const filteredProjects = filter
    ? projects.filter((project) => doesProjectMatchFilter(project, filter))
    : projects; // Don't filter if no filter is set

  // Scroll to the projects section when the filter changes from empty to non-empty
  const prevFilteredProjectsLength = useRef(filteredProjects.length);
  useEffect(() => {
    if (
      prevFilteredProjectsLength.current === 0 &&
      filteredProjects.length > 0
    ) {
      const element = document.querySelector(".projects");
      element?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    prevFilteredProjectsLength.current = filteredProjects.length;
  }, [filteredProjects]);

  return (
    <div className="projects mt-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 className="text-2xl font-semibold">Projects</h2>
        <FilterField filter={filter} setFilter={setFilter} />
      </div>
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Project key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center text-center text-gray-500 dark:text-gray-400 text-2xl h-50">
          No projects matched the filter
        </div>
      )}
    </div>
  );
}

const FilterField = ({
  filter,
  setFilter,
}: {
  filter: string;
  setFilter: (value: string) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    /// Update the input value when the input-element's value doesn't match the app state
    if (inputRef.current?.value && inputRef.current?.value !== filter) {
      inputRef.current.value = filter;
    }
  }, []);

  return (
    <div className="relative w-full sm:w-96">
      <input
        ref={inputRef}
        className="shadow appearance-none border rounded w-full bg-white py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10 placeholder-gray-700"
        type="text"
        placeholder="Filter projects..."
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
      />
      <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 w-5 h-5" />
    </div>
  );
};

const Project = ({ project }: { project: PopulatedProject }) => {
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
