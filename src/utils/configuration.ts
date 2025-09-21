import { ConfigurationError } from "./errors";
import YAML from "yaml";
import {
  ConfigurationSchema,
  GitHubRepositorySchema,
  GitHubUserSchema,
} from "./schemas";
import type { Configuration, PopulatedConfiguration } from "./types";
import { GITHUB_TOKEN } from "./env";
import cache from "./cache";

export const getConfiguration = async (filePath: string) => {
  const configFileContent = await getFileContent(filePath);

  if (!configFileContent) {
    throw new ConfigurationError(`Configuration file at "${filePath}" empty`);
  }

  const configuration = await parseConfigurationString(configFileContent);

  const populatedConfiguration = await populateConfiguration(configuration);

  return populatedConfiguration;
};

const getFileContent = async (filePath: string) => {
  try {
    const file = Bun.file(filePath);
    const text = await file.text();
    return text;
  } catch (error) {
    throw new ConfigurationError(`Failed reading file "${filePath}"`, {
      error,
    });
  }
};

const parseConfigurationString = async (configurationString: string) => {
  try {
    const parsedConfiguration = YAML.parse(configurationString);
    const validatedConfiguration =
      await ConfigurationSchema.parseAsync(parsedConfiguration);

    return validatedConfiguration;
  } catch (error) {
    throw new ConfigurationError("Failed parsing configuration", {
      error,
    });
  }
};

const populateConfiguration = async (
  configuration: Configuration
): Promise<PopulatedConfiguration> => {
  const github_user_url = `https://github.com/${configuration.github_username}`;

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

        const project_url =
          (project.url || githubProjectInfo?.homepage) ?? undefined;

        const image_url = project.image_url
          ? project.image_url
          : typeof project.image_url === "undefined" && project_url
            ? `https://www.google.com/s2/favicons?domain=${project_url}&sz=64`
            : undefined;

        return {
          ...project,
          id: Bun.randomUUIDv7(),
          technologies: Array.from(new Set(project.technologies)), // Remove duplicate technologies
          github_repository_url:
            project.github_repository &&
            `https://github.com/${project.github_repository}`,
          image_url,
          name: project.name || githubProjectInfo?.name,
          description: project.description || githubProjectInfo?.description,
          url: project_url,
          languages: project.languages || githubProjectInfo?.languages,
        };
      }) ?? [],
    github_user_url,
    description: configuration.description || github_user_info?.bio,
    image_url: configuration.image_url || github_user_info?.avatar_url,
    name: configuration.name || github_user_info?.name,
    title: configuration.title || "Portfolio",
  };

  return populatedConfiguration;
};

const defaultGithubHeaders = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
};

const getUserInfo = async (github_username: string) => {
  const url = `https://api.github.com/users/${github_username}`;

  try {
    const cachedValue = await cache.fetch(url);
    if (cachedValue) {
      return await GitHubUserSchema.parseAsync(cachedValue);
    }
    const response = await Bun.fetch(url, { headers: defaultGithubHeaders });
    if (!response.ok) {
      throw new ConfigurationError(`HTTP error! Status: ${response.status}`);
    }
    const userInfo = await response.json();

    await cache.store(url, userInfo);

    return await GitHubUserSchema.parseAsync(userInfo);
  } catch (error) {
    throw new ConfigurationError(
      `Failed fetching GitHub user info for ${github_username}`,
      {
        error,
      }
    );
  }
};

const getRepositoryInfo = async (github_repository: string) => {
  const url = `https://api.github.com/repos/${github_repository}`;
  try {
    const cachedValue = await cache.fetch(url);
    if (cachedValue) {
      return await GitHubRepositorySchema.parseAsync(cachedValue);
    }
    const response = await Bun.fetch(url, { headers: defaultGithubHeaders });
    if (!response.ok) {
      throw new ConfigurationError(`HTTP error! Status: ${response.status}`);
    }
    const repositoryInfo = await response.json();

    if (repositoryInfo.languages_url) {
      const response = await Bun.fetch(repositoryInfo?.languages_url, {
        headers: defaultGithubHeaders,
      });
      if (!response.ok) {
        throw new ConfigurationError(`HTTP error! Status: ${response.status}`);
      }
      const languages = await response.json();
      repositoryInfo.languages = Object.keys(languages);
    }

    await cache.store(url, repositoryInfo);

    return await GitHubRepositorySchema.parseAsync(repositoryInfo);
  } catch (error) {
    throw new ConfigurationError(
      `Failed fetching repository info for ${github_repository}`,
      { error }
    );
  }
};
