import { NavLink } from "react-router-dom";

function HomePage() {
	return (
		<div>
			<NavLink to="/team-register">
				<button>Register Your Team</button>
			</NavLink>
		</div>
	);
}

export default HomePage;
