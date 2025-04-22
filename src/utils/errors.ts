export class LoggedError extends Error {
  constructor(message: string) {
    console.error(message);
    super(message);
  }
}

export class ConfigurationError extends LoggedError {}
export class UnknownConfigurationError extends ConfigurationError {
  constructor() {
    super("Unknown configuration error");
  }
}
export class FileReadError extends ConfigurationError {}
export class ConfigurationFileEmptyError extends ConfigurationError {
  constructor() {
    super("Configuration file is empty");
  }
}
export class ConfigurationParsingError extends ConfigurationError {}
