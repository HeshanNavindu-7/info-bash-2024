import { NavLink } from "react-router-dom";
import "./NavigationBar.scss";
import { useUser } from "../../Hooks/useUser";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { Auth } from "../../firebase.init";
import { useEffect, useRef, useState } from "react";

function NavigationBar() {
	const user = useUser();
	const [show, setShow] = useState(false);
	const subMenu = useRef(null);
	const img = useRef(null);

	function clickEvent(e) {
		if (e.target != img.current && !subMenu.current.contains(e.target)) setShow(false);
	}

	useEffect(() => {
		window.addEventListener("click", clickEvent);
		return () => window.removeEventListener("click", clickEvent);
	}, []);

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
					ref={img}
					onClick={() => setShow((a) => !a)}
					src={
						user.data?.photoURL ??
						"https://cdn.vectorstock.com/i/preview-1x/66/14/default-avatar-photo-placeholder-profile-picture-vector-21806614.jpg"
					}
					alt=""
				/>
				<div hidden={!show} ref={subMenu} className="sub-menu">
					{user.data !== undefined && user.data !== null && (
						<>
							<div>{user.data.displayName}</div>
							{user.isAdmin && (
								<div>
									<NavLink to="/admin">
										<button>Admin Panel</button>
									</NavLink>
								</div>
							)}
							<div>
								<button onClick={() => signOut(Auth)}>Sign Out</button>
							</div>
						</>
					)}
					{user.data === null && (
						<>
							<div>
								<button
									onClick={() => {
										const provider = new GoogleAuthProvider();
										signInWithPopup(Auth, provider);
									}}
								>
									Sign In
								</button>
							</div>
						</>
					)}
				</div>
			</div>
		</nav>
	);
}

export default NavigationBar;
