import { NavLink } from "react-router-dom";

function NavBar() {
	return (
		<nav>
			<ul>
				<li>
					<NavLink to="/admin">Teams</NavLink>
				</li>
				<li>
					<NavLink to="/admin/groups">Groups</NavLink>
				</li>
				<li>
					<NavLink to="/admin/matches">Matches</NavLink>
				</li>
			</ul>
		</nav>
	);
}

export default NavBar;
