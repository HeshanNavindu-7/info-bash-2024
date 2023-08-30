import React from "react";
import ReactDOM from "react-dom/client";
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import "./main.scss";
import User from "./pages/User/User.jsx";
import HomePage from "./pages/User/Home/HomePage";
import UserTeams from "./pages/User/Teams/Teams";
import UserMatches from "./pages/User/Matches/Matches";
import { AuthProvider } from "./Hooks/useUser";
import TeamRegister from "./pages/User/TeamRegister/TeamRegister";
import Admin from "./pages/Admin/Admin";
import AdminTeams from "./pages/Admin/Teams/Teams";
import Groups from "./pages/Admin/Groups/Groups";
import AdminMatches from "./pages/Admin/Matches/Matches";
import UserTeamView from "./pages/User/Teams/TeamView";
import MatchEdit from "./pages/Admin/Matches/MatchEdit";
import MatchLive from "./pages/User/Matches/MatchLive";

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
				element: <UserTeams />,
			},
			{
				path: "teams/:teamID",
				element: <UserTeamView />,
			},
			{
				path: "matches",
				element: <UserMatches />,
			},
			{
				path: "matches/:matchID",
				element: <MatchLive />,
			},
			{
				path: "team-register",
				element: <TeamRegister />,
			},
		],
	},
	{
		path: "/admin",
		element: <Admin />,
		children: [
			{
				index: true,
				element: <Navigate to="/admin/teams" />,
			},
			{
				path: "teams",
				element: <AdminTeams />,
			},
			{
				path: "groups",
				element: <Groups />,
			},
			{
				path: "matches",
				element: <AdminMatches />,
			},
			{
				path: "matches/:matchID",
				element: <MatchEdit />,
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<AuthProvider>
		<RouterProvider router={routers} />
	</AuthProvider>
);
