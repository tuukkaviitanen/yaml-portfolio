# YAML Portfolio

> Generates a portfolio website from a local YAML file

## Summary

A [Bun](https://bun.sh/) (and formerly [Next.js](https://nextjs.org/)) application that reads a server-side [YAML](https://www.redhat.com/en/topics/automation/what-is-yaml)-file with portfolio configuration, and using [React](https://react.dev/) to render the portfolio on the server, before serving it to the client as pure HTML and hydrating it to enable client side rendered React as well. By configuring a GitHub username and the GitHub project names in the YAML, the server fetches most information automatically from the [GitHub API](https://docs.github.com/en/rest). To reduce the amount of calls made to the API, the requests are cached in a [Redis](https://redis.io/) database.

## Technical Rambling

I wanted to use Next.js for the application, to allow rendering the application on the backend, but still being able to run React on the client-side as well. For a use-case this light, Next.js proved to be admittedly over-engineering, so I migrated back to just React with Bun, for smaller footprint and better performance. The Next.js is still present until version [0.0.2](https://github.com/tuukkaviitanen/yaml-portfolio/pkgs/container/yaml-portfolio/403226269?tag=0.0.2) and can be viewed in the [nextjs-version](https://github.com/tuukkaviitanen/yaml-portfolio/tree/nextjs-version) branch.

Turns out the React library allows [rendering the application to a stream](https://react.dev/reference/react-dom/server/renderToReadableStream), which can be sent from the server to the client. This sends a pure HTML stream to the client, and can be used without any client side React code at all. However, for client side rendering React (for dynamic project filtering in this case), [the server rendered HTML can be "hydrated" on the client](https://react.dev/reference/react-dom/client/hydrateRoot). In practise hydrating means rendering the same React application again on the client side when the JavaScript bundle loads. The application needs to render identically, so the user doesn't notice this second render. In this case, the portfolio configuration is sent to the client with the initial HTML stream, so it can be rendered again on the client with the same content.
To render the application on the server and on the client, both the server and client JavaScript code bundles need to contain the same React application code and the React library. This can be achieved easily with shared source code and by building the application with separate client and server entrypoints, using Bun's bundler. The bundler bundles each entrypoint with their dependencies into single standalone JavaScript files. The bundler can even be run in the code via [Bun's JavaScript API](https://bun.sh/docs/bundler), to build the client bundle again every time the server restarts in development mode (when I compile the [Tailwind CSS](https://tailwindcss.com/) bundle as well).

By cutting Next.js out of the equation, the size of the final Docker image was cut down by ~67% (~270MB -> ~90MB). It also dramatically reduces the amount of traffic to the browser. Undoubtedly full-fledged React frameworks like Next.js provide important features for large-scale applications, but for use-cases like this, where even using React might be considered as over-engineering to some, this setup seems quite valid. Still offering the benefits of server side rendering, like faster page loads and search engine optimization, without the added complexity of a full-stack framework.

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
