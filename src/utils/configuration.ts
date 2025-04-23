import { z } from "zod";
import {
  ConfigurationFetchingError,
  ConfigurationFileEmptyError,
  ConfigurationParsingError,
  FileReadError,
} from "./errors";
import YAML from "yaml";

const LinkSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  icon_url: z.string().url().optional(),
});

type Link = z.infer<typeof LinkSchema>;

const ProjectSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  url: z.string().url().optional(),
  github_repository: z.string().optional(),
  image_url: z.string().url().optional(),
  languages: z.array(z.string()).optional(),
});

type Project = z.infer<typeof ProjectSchema>;

const ConfigurationSchema = z.object({
  name: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  image_url: z.string().url().optional(),
  github_username: z.string(),
  links: z.array(LinkSchema).optional(),
  projects: z.array(ProjectSchema).optional(),
});

const GitHubUserSchema = z.object({
  avatar_url: z.string().url(),
  url: z.string().url(),
  html_url: z.string().url(),
  name: z.string(),
  location: z.string(),
  bio: z.string(),
});

const GitHubRepositorySchema = z.object({
  name: z.string(),
  html_url: z.string().url(),
  description: z.string().optional(),
  languages_url: z.string().url(),
  created_at: z.string(),
  updated_at: z.string(),
  language: z.string().optional(),
  homepage: z.string(),
});

export type Configuration = z.infer<typeof ConfigurationSchema>;

export const getConfiguration = async (filePath: string) => {
  const configFileContent = await getFileContent(filePath);

  const existingConfiguration = await Bun.redis.get(filePath);

  if (existingConfiguration) {
    const parsedConfiguration = JSON.parse(
      existingConfiguration
    ) as PopulatedConfiguration;
    return parsedConfiguration;
  }

  if (!configFileContent) {
    throw new ConfigurationFileEmptyError();
  }

  const configuration = await parseConfigurationString(configFileContent);

  const populatedConfiguration = await populateConfiguration(configuration);

  await Bun.redis.set(filePath, JSON.stringify(populatedConfiguration));
  await Bun.redis.expire(filePath, 3600);

  return populatedConfiguration;
};

const getFileContent = async (filePath: string) => {
  try {
    const file = Bun.file(filePath);
    const text = await file.text();
    return text;
  } catch (error) {
    if (error instanceof Error) {
      throw new FileReadError(`File read error: ${error.message}`);
    } else {
      throw new FileReadError("Unknown file read error");
    }
  }
};

const parseConfigurationString = async (configurationString: string) => {
  try {
    const parsedConfiguration = YAML.parse(configurationString);
    const validatedConfiguration = await ConfigurationSchema.parseAsync(
      parsedConfiguration
    );

    return validatedConfiguration;
  } catch (error) {
    if (error instanceof Error) {
      throw new ConfigurationParsingError(
        `Configuration parsing error: ${error.message}`
      );
    } else {
      throw new ConfigurationParsingError(
        "Unknown configuration parsing error"
      );
    }
  }
};

export type PopulatedConfiguration = Omit<
  Configuration,
  "links" | "projects"
> & {
  links: Array<Link & { id: string }>;
  projects: Array<
    Project & {
      id: string;
      github_repository_url?: string;
      github_repository_api_url?: string;
      image_url?: string;
    }
  >;
  github_user_url?: string;
};

const populateConfiguration = async (
  configuration: Configuration
): Promise<PopulatedConfiguration> => {
  const github_user_url = `https://github.com/${configuration.github_username}`;
  const github_user_api_url = `https://api.github.com/users/${configuration.github_username}`;

  let github_user_info;
  try {
    github_user_info = await getUserInfo(configuration.github_username);
  } catch {
    github_user_info = undefined;
  }
  const github_repository_infos = new Map(
    await Promise.all(
      configuration.projects
        ?.filter((project) => project.github_repository) // Make sure the project has a github_repository defined
        .map(async (project) => {
          try {
            const repositoryInfo = await getRepositoryInfo(
              project.github_repository!
            );
            return [project.github_repository!, repositoryInfo] as const;
          } catch {
            return [project.github_repository!, undefined] as const;
          }
        }) ?? []
    )
  );

  const populatedConfiguration = {
    ...configuration,
    links:
      configuration.links
        ?.concat({
          name: "GitHub",
          url: github_user_url,
        })
        .map((link) => ({
          ...link,
          id: Bun.randomUUIDv7(),
          icon_url:
            link.icon_url ||
            (link.url &&
              `https://www.google.com/s2/favicons?domain=${link.url}&sz=64`),
        })) ?? [],
    projects:
      configuration.projects?.map((project) => {
        const githubProjectInfo = project.github_repository
          ? github_repository_infos.get(project.github_repository)
          : undefined;

        return {
          ...project,
          id: Bun.randomUUIDv7(),
          languages: Array.from(new Set(project.languages)), // Remove duplicate languages
          github_repository_url:
            project.github_repository &&
            `https://github.com/${project.github_repository}`,
          github_repository_api_url:
            project.github_repository &&
            `https://api.github.com/repos/${project.github_repository}`,
          image_url:
            project.image_url ||
            (project.url &&
              `https://www.google.com/s2/favicons?domain=${project.url}&sz=64`),
          name: project.name || githubProjectInfo?.name,
          description: project.description || githubProjectInfo?.description,
          url: project.url || githubProjectInfo?.homepage,
        };
      }) ?? [],
    github_user_api_url,
    github_user_url,
    description: configuration.description || github_user_info?.bio,
    image_url: configuration.image_url || github_user_info?.avatar_url,
    name: configuration.name || github_user_info?.name,
  };

  return populatedConfiguration;
};

const getUserInfo = async (github_username: string) => {
  const url = `https://api.github.com/users/${github_username}`;
  try {
    const response = await Bun.fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const userInfo = await response.json();
    return await GitHubUserSchema.parseAsync(userInfo);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown validation error";
    throw new ConfigurationFetchingError(
      `GitHub API User info validation error: ${errorMessage}`
    );
  }
};

const getRepositoryInfo = async (github_repository: string) => {
  const url = `https://api.github.com/repos/${github_repository}`;
  try {
    const response = await Bun.fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const repositoryInfo = await response.json();
    return await GitHubRepositorySchema.parseAsync(repositoryInfo);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown validation error";
    throw new ConfigurationFetchingError(
      `GitHub API Repository info validation error: ${errorMessage}`
    );
  }
};
