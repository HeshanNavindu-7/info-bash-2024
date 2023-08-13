import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./main.scss";
import User from "./pages/User/User.jsx";
import HomePage from "./pages/User/Home/HomePage";
import Teams from "./pages/User/Teams/Teams";
import Matches from "./pages/User/Matches/Matches";
import { AuthProvider } from "./Hooks/useUser";
import TeamRegister from "./pages/User/TeamRegister/TeamRegister";
import TeamView from "./pages/User/Teams/TeamView";

const routers = createBrowserRouter([
	{
		path: "/",
		element: <User />,
		children: [
			{
				index: true,
				element: <HomePage />,
			},
			{
				path: "teams",
				element: <Teams />,
			},
			{
				path: "teams/:teamID",
				element: <TeamView />,
			},
			{
				path: "matches",
				element: <Matches />,
			},
			{
				path: "team-register",
				element: <TeamRegister />,
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<AuthProvider>
			<RouterProvider router={routers} />
		</AuthProvider>
	</React.StrictMode>
);
