import type { Configuration } from "./utils/configuration";

type AppParams = {configuration: Configuration}
const App = ({configuration}: AppParams) => {

    return (<div>Hello my guy! {configuration.github_username}</div>)
}

export default App;
