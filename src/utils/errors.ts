type ErrorConfig =
  | {
      error?: unknown;
    }
  | undefined;

export class LoggedError extends Error {
  sourceError?: Error;
  constructor(message: string, config?: ErrorConfig) {
    super(message);

    if (config?.error instanceof Error) {
      this.sourceError = config?.error;
    }
    {
      this.sourceError = new Error(config?.error?.toString());
    }

    console.error(this.toString());
  }

  toString() {
    return `Error occurred: ${
      this.message
    },\nWrapped error: ${this.sourceError?.toString()}`;
  }
}

export class ConfigurationError extends LoggedError {}
