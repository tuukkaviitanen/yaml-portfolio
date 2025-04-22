import type { PopulatedConfiguration } from "./utils/configuration";

type AppParams = { configuration: PopulatedConfiguration };
const App = ({ configuration }: AppParams) => {
  const { description, image_url, links, projects } = configuration;
  return (
    <main>
      <header>
        <h1>Portfolio</h1>
      </header>
      <div className="container">
        <div className="profile">
          <img src={image_url} width="200" />
          <h2>About Me</h2>
          <h3>{configuration.name}</h3>
          <p>{description}</p>
        </div>
        <h2>Links</h2>
        <div className="links">
          {links?.map((link) => (
            <li key={link.id}>
              <a href={link.url}>
                <img src={link.icon_url} width="20" />
                {link.name}
              </a>
            </li>
          ))}
        </div>
        <div className="projects">
          <h2>Projects</h2>
          {projects?.map((project) => (
            <div key={project.id} className="project">
              <img src={project.image_url} width="64" />
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <a href={project.url}>{project.url}</a>
              <a href={project.github_repository_url}>
                {project.github_repository_url}
              </a>
              {project.languages?.map((language) => (
                <li key={language}>{language}</li>
              ))}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default App;
