import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import seedrandom from "seedrandom";
import useStore from "../hooks/useStore";
import type { PopulatedConfiguration, PopulatedProject } from "../utils/types";
import Link from "./Link";
import { QuaternaryTitle, TertiaryTitle, Text } from "./Typography";

const doesProjectMatchFilter = (
  project: PopulatedProject,
  filter: string,
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

const shuffleArray = (array: Array<any>, randomGenerator: seedrandom.PRNG) =>
  array
    .map((item) => ({ item, sort: randomGenerator() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);

const getShuffledTags = (
  projects: PopulatedProject[],
  numberOfTags: number,
) => {
  const allTags = projects.flatMap((project) => [
    ...(project.languages ?? []),
    ...(project.technologies ?? []),
  ]);
  const shuffledTags = shuffleArray(allTags, seedrandom(getSeed()));
  const uniqueTags = Array.from(new Set(shuffledTags));
  // Filter unique tags only after shuffling, so tags with higher occurrences have higher chance of showing up

  return uniqueTags.slice(0, numberOfTags);
};

type ProjectsProps = {
  projects: PopulatedConfiguration["projects"];
};

export default function Projects({ projects }: ProjectsProps) {
  const { filter, setFilter } = useStore();

  // Get tags only on first render
  const [popularTags] = useState(getShuffledTags(projects, 5));
  const isFirstRender = useRef(true);

  const filteredProjects = filter
    ? projects.filter((project) => doesProjectMatchFilter(project, filter))
    : projects; // Don't filter if no filter is set

  useEffect(() => {
    // Don't scroll on first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const element = document.querySelector(".projects");
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [filteredProjects]);

  if (!projects?.length) {
    return null;
  }

  return (
    <div className="projects mt-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
        <h2 className="text-2xl font-semibold">Projects</h2>
        <div className="px-4 py-2 bg-white dark:bg-secondary rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow-md hover:shadow-2xl transition-all duration-300 ease-in-out">
          <Chips list={popularTags} />
          <FilterField filter={filter} setFilter={setFilter} />
        </div>
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
    <div className="relative w-full md:w-96 hover:shadow-2xl transition-all duration-300 ease-in-out">
      <input
        ref={inputRef}
        className="shadow appearance-none border rounded w-full bg-white py-2 px-3 text-primary leading-tight pr-17 placeholder-primary/70"
        type="text"
        placeholder="Filter projects..."
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
        name="project-filter"
      />
      {filter && (
        <button
          onClick={() => setFilter("")}
          type="button"
          className="hover:cursor-pointer hover:opacity-50 focus:opacity-50 transition-opacity duration-300 ease-in-out"
        >
          <XMarkIcon className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-700 w-5 h-5" />
        </button>
      )}
      <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 w-5 h-5" />
    </div>
  );
};

const Project = ({ project }: { project: PopulatedProject }) => {
  return (
    <div
      key={project.id}
      className="bg-white shadow-md rounded-lg p-6 dark:bg-secondary hover:shadow-2xl transition-all duration-300 ease-in-out"
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
    <div className="flex flex-wrap gap-2 justify-center">
      {list?.map((item) => (
        <button
          key={item}
          className="bg-accent/20 dark:bg-accent text-sm px-4 py-2 rounded-full hover:cursor-pointer hover:shadow-2xl hover:bg-accent/80 hover:text-white transition-all duration-300 ease-in-out"
          onClick={() => setFilter(item)}
          type="button"
        >
          <span className="dark:text-white/90">{item}</span>
        </button>
      ))}
    </div>
  );
};
