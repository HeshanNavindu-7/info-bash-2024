import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { Auth } from "../firebase.init";

const AuthContext = createContext();

export function useUser() {
	return useContext(AuthContext);
}

export function AuthProvider({ children }) {
	const [user, setUser] = useState({});

	useEffect(() => {
		return onAuthStateChanged(Auth, (user) => {
			console.log("User", user);
		});
	}, []);

	return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}
