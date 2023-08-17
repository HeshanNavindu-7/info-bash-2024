import { Outlet } from "react-router-dom";
import NavBar from "../../Components/AdminNavBar/NavBar";

function Admin() {
	return (
		<>
			<div>
				<NavBar />
			</div>

			<div className="admin-container">
				<Outlet />
			</div>
		</>
	);
}

export default Admin;
