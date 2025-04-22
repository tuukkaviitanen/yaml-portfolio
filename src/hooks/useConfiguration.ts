import { useState, useEffect } from "react";
import { ConfigurationError, UnknownConfigurationError } from "../errors";
import parseConfiguration from "../utils/parseConfiguration";

export function useConfiguration() {
  const [configuration, setConfiguration] = useState<any | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function getConfiguration() {
      try {
        setLoading(true);
        const configuration = await parseConfiguration();
        setConfiguration(configuration);
      } catch (error) {
        if (error instanceof ConfigurationError) {
          setError(error);
        } else {
          setError(new UnknownConfigurationError());
        }
      } finally {
        setLoading(false);
      }
    }

    getConfiguration();
  }, []);

  return { content: configuration, error, loading };
}
