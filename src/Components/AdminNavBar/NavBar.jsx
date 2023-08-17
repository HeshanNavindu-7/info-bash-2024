import { NavLink } from "react-router-dom";
import "./NavBar.scss";

function NavBar() {
	return (
		<nav className="admin-nav-bar">
			<ul>
				<li>
					<NavLink to="/admin/teams">Teams</NavLink>
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
