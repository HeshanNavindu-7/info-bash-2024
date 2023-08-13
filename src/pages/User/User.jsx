import { Outlet } from "react-router-dom";
import NavigationBar from "../../Components/NavigationBar/NavigationBar";

function User() {
	return (
		<>
			<div>
				<NavigationBar />
			</div>

			<div className="outlet-container">
				<Outlet />
			</div>
		</>
	);
}

export default User;
