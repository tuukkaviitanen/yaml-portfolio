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
    } else if (config?.error) {
      this.sourceError = new Error(config?.error.toString());
    }

    console.error(this.toString());
  }

  toString() {
    const wrappedError = `,\nWrapped error: ${this.sourceError?.toString()}`;
    return `Error occurred: ${this.message}${
      this.sourceError ? wrappedError : ""
    }`;
  }
}

export class ConfigurationError extends LoggedError {}
