import { NavLink } from "react-router-dom";
import "./HomePage.scss";

function HomePage() {
	return (
		<div className="home-page">
			<div className="title">
				INFO <span>BASH</span>
			</div>
			<NavLink to="/team-register">
				<button>Register Your Team</button>
			</NavLink>
		</div>
	);
}

export default HomePage;
