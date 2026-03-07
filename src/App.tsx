import { Route, Switch } from "wouter";
import { Home } from "./Home";
import { Board } from "./Board";
import { FilesProvider } from "./FilesContext";
import { CommandMenu } from "./CommandMenu";
import "./cmdk.css";

export function App() {
	return (
		<FilesProvider>
			<CommandMenu />
			<Switch>
				<Route path="/" component={Home} />
				<Route path="/board/:slug" component={Board} />
			</Switch>
		</FilesProvider>
	);
}
