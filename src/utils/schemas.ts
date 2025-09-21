import { z } from "zod";

export const LinkSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  icon_url: z.string().url().optional(),
});

export const ProjectSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  url: z.string().url().optional(),
  github_repository: z.string().optional(),
  image_url: z.string().url().optional().nullable(),
  languages: z.array(z.string()).optional(),
  technologies: z.array(z.string()).optional(),
});

export const ConfigurationSchema = z.object({
  name: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  image_url: z.string().url().optional(),
  github_username: z.string(),
  links: z.array(LinkSchema).optional(),
  projects: z.array(ProjectSchema).optional(),
});

export const GitHubUserSchema = z.object({
  avatar_url: z.string().url(),
  url: z.string().url(),
  html_url: z.string().url(),
  name: z.string(),
  location: z.string(),
  bio: z.string(),
});

export type GitHubUser = z.infer<typeof GitHubUserSchema>;

export const GitHubRepositorySchema = z.object({
  name: z.string(),
  html_url: z.string().url(),
  description: z.string().optional(),
  languages_url: z.string().url(),
  created_at: z.string(),
  updated_at: z.string(),
  language: z.string().optional(),
  homepage: z.string().nullable(),
  languages: z.array(z.string()).optional(),
});

export type GitHubRepository = z.infer<typeof GitHubRepositorySchema>;
