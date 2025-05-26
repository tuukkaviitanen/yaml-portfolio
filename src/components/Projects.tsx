import { useEffect, useRef, useState } from "react";
import Link from "./Link";
import { QuaternaryTitle, TertiaryTitle, Text } from "./Typography";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import type { PopulatedConfiguration, PopulatedProject } from "../utils/types";
import useStore from "../hooks/useStore";
import seedrandom from "seedrandom";

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

/**
 * @returns Seed for the last hour
 */
const getSeed = () => {
  const now = new Date();

  const lastHour = new Date(now);
  lastHour.setMinutes(0);
  lastHour.setSeconds(0);
  lastHour.setMilliseconds(0);

  const seed = lastHour.toISOString();
  return seed;
};

const suffleArray = (array: Array<any>, randomGenerator: seedrandom.PRNG) =>
  array
    .map((item) => ({ item, sort: randomGenerator() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);

const getSuffledTags = (projects: PopulatedProject[], numberOfTags: number) => {
  const allTags = projects.flatMap((project) => [
    ...(project.languages ?? []),
    ...(project.technologies ?? []),
  ]);
  const suffledTags = suffleArray(allTags, seedrandom(getSeed()));
  const uniqueTags = Array.from(new Set(suffledTags));
  // Filter unique tags only after suffling, so tags with higher occurances have higher change of showing up

  return uniqueTags.slice(undefined, numberOfTags);
};

type ProjectsProps = {
  projects: PopulatedConfiguration["projects"];
};

export default function Projects({ projects }: ProjectsProps) {
  if (!projects?.length) {
    return null;
  }
  const { filter, setFilter } = useStore();
  // Get tags only on first render
  const [popularTags] = useState(getSuffledTags(projects, 5));

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
        <Chips list={popularTags} />
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
    <div className="relative w-full sm:w-96  hover:shadow-2xl transition-all duration-300 ease-in-out">
      <input
        ref={inputRef}
        className="shadow appearance-none border rounded w-full bg-white py-2 px-3 text-primary leading-tight focus:outline-none focus:ring-2 focus:ring-accent focus:border-blue pr-10 placeholder-primary/70"
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
      className="project bg-white shadow-md rounded-lg p-6 dark:bg-secondary dark:shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out"
    >
      {project.image_url && (
        <img
          loading="lazy"
          alt={`Project image for ${project.name}`}
          src={project.image_url}
          height={128}
          width={128}
          className="rounded mb-4 mx-auto"
        />
      )}
      <TertiaryTitle>{project.name}</TertiaryTitle>
      <Text>{project.description}</Text>
      <div className="space-y-2">
        <ProjectLink title="Project Page" link={project.url} />
        <ProjectLink
          title="GitHub Repository"
          link={project.github_repository_url}
        />
      </div>
      <TagList title="Languages" list={project.languages} />
      <TagList title="Technologies" list={project.technologies} />
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

const TagList = ({ title, list }: { title: string; list?: string[] }) => {
  return (
    list?.length && (
      <div className="flex flex-col gap-2">
        <QuaternaryTitle>{title}</QuaternaryTitle>
        <Chips list={list} />
      </div>
    )
  );
};

const Chips = ({ list }: { list: string[] }) => {
  const { setFilter } = useStore();

  return (
    <ul className="flex flex-wrap gap-2 justify-center">
      {list?.map((item) => (
        <li
          key={item}
          className="bg-accent/20 dark:bg-accent text-sm px-3 py-1 rounded-full hover:cursor-pointer hover:shadow-2xl hover:bg-accent/80 hover:text-white transition-all duration-300 ease-in-out"
          onClick={() => setFilter(item)}
        >
          <span className="dark:text-white/90">{item}</span>
        </li>
      ))}
    </ul>
  );
};
