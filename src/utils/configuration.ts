import { z } from "zod";
import {
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

const ProjectSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  url: z.string().url().optional(),
  github_repository: z.string().optional(),
  image_url: z.string().url().optional(),
  languages: z.array(z.string()).optional(),
});

const ConfigurationSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  image_url: z.string().url().optional(),
  github_username: z.string().optional(),
  links: z.array(LinkSchema).optional(),
  projects: z.array(ProjectSchema).optional(),
});

export type Configuration = z.infer<typeof ConfigurationSchema>;

export const getConfiguration = async (filePath: string) => {
  const configFileContent = await getFileContent(filePath);

  if (!configFileContent) {
    throw new ConfigurationFileEmptyError();
  }

  const configuration = await parseConfigurationString(configFileContent);

  return configuration;
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
