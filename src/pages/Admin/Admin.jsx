import { Navigate, Outlet } from "react-router-dom";
import NavBar from "../../Components/AdminNavBar/NavBar";
import { useUser } from "../../Hooks/useUser";

function Admin() {
   const user = useUser();
	if (user.isAdmin == null) return "";
	if (user.isAdmin == false) return <Navigate to="/" />;

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
