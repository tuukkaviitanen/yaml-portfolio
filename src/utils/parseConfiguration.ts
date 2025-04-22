import { ConfigurationFileEmptyError, FileReadError } from "./errors";
import YAML from "yaml";

const parseConfiguration = async () => {
  const filePath = Bun.env.CONFIG_FILE_PATH || "./config.json";
  const configFileContent = await getFileContent(filePath);

  if (!configFileContent) {
    throw new ConfigurationFileEmptyError();
  }

  const configuration = YAML.parse(configFileContent);

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

export default parseConfiguration;
