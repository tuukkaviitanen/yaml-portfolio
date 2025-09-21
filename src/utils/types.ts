import type { z } from "zod";
import type { ConfigurationSchema, LinkSchema, ProjectSchema } from "./schemas";

export type Link = z.infer<typeof LinkSchema>;

export type Project = z.infer<typeof ProjectSchema>;

export type Configuration = z.infer<typeof ConfigurationSchema>;

export type PopulatedProject = Project & {
  id: string;
  github_repository_url?: string;
  image_url?: string;
  languages?: Array<string>;
};

export type PopulatedLink = Link & {
  id: string;
  icon_url?: string;
};

export type PopulatedConfiguration = Omit<
  Configuration,
  "links" | "projects"
> & {
  links: PopulatedLink[];
  projects: PopulatedProject[];
  github_user_url?: string;
};
