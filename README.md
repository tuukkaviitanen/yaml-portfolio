# YAML Portfolio

> Generates a portfolio website from a local YAML file

## Summary

A [Bun](https://bun.sh/) and [Next.js](https://nextjs.org/) application that reads a server-side [YAML](https://www.redhat.com/en/topics/automation/what-is-yaml)-file with portfolio configuration, and renders the portfolio on the server, before serving it to the client. By configuring a GitHub username and the GitHub project names, the server fetches most information automatically from the [GitHub API](https://docs.github.com/en/rest). To reduce the amount of calls made to the API, the requests are cached in a [Redis](https://redis.io/) database.

## Technical Rambling

I wanted to use Next.js for the application, to allow rendering the application on the backend, but still being able to run [React](https://react.dev/) on the client-side as well. This dynamic side of the client-side application is not yet implemented, so using Next.js is admittedly over-engineering. I still wanted to try it out, but I'm planning to scrap Next.js from the equation.

## How to run locally

### Simpler way

To run the application without cloning the entire repository, you can follow these steps:

1. Make sure [Docker](https://www.docker.com/) is installed in your system
2. Create a `portfolio.yaml` file
   - You can follow the data-structure of [portfolio.template.yaml](/portfolio.template.yaml)
3. Create a `docker-compose.yaml` file and copy there the contents of [docker-compose.standalone.yaml](docker-compose.standalone.yaml)
4. Run the app with `docker compose up`

### Cloning the repository

You can run the application locally by cloning the whole repository:

1. Make sure [Docker](https://www.docker.com/) is installed in your system
2. Clone this GitHub repository locally
3. Create a `portfolio.yaml` file in the cloned repository root
   - You can follow the data-structure of [portfolio.template.yaml](/portfolio.template.yaml)
4. Run the [docker-compose.prod.yaml](/docker-compose.prod.yaml) file with the command:

   `docker compose -f docker-compose.prod.yaml up`

   - This starts the application with the Redis database
   - For development purposes, you can run the [docker-compose.dev.yaml](/docker-compose.dev.yaml) file instead to watch for code changes as well

5. Open your browser to [http://localhost:3000](http://localhost:3000)

6. You can edit the `portfolio.yaml` and the changes can be seen in the application by refreshing the webpage
