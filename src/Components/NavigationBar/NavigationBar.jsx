import { NavLink } from "react-router-dom";
import "./NavigationBar.scss";

function NavigationBar() {
	return (
		<nav className="navigation-bar">
			<div className="logo">
				<NavLink to="/">
					<img src="/images/info_bash-1.png" alt="" />
               INFO BASH
				</NavLink>
			</div>
			<div className="links">
				<ul>
					<li>
						<NavLink to="/matches">Matches</NavLink>
					</li>
					<li>
						<NavLink to="/teams">Teams</NavLink>
					</li>
				</ul>
			</div>
			<div className="menu"></div>
		</nav>
	);
}

export default NavigationBar;
