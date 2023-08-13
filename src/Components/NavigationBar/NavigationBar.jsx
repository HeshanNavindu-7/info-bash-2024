import { NavLink } from "react-router-dom";
import "./NavigationBar.scss";
import { useUser } from "../../Hooks/useUser";

function NavigationBar() {
	const user = useUser();

	return (
		<nav className="navigation-bar">
			<div className="logo">
				<NavLink to="/">
					<img src="/images/info_bash-1.png" alt="" />
					<span>INFO BASH</span>
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
			<div className="menu">
				<img
					src={
						user.data?.photoURL ??
						"https://cdn.vectorstock.com/i/preview-1x/66/14/default-avatar-photo-placeholder-profile-picture-vector-21806614.jpg"
					}
					alt=""
				/>
			</div>
		</nav>
	);
}

export default NavigationBar;
