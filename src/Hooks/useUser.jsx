import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { Auth, FS } from "../firebase.init";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export function useUser() {
	return useContext(AuthContext);
}

export function AuthProvider({ children }) {
	const [user, setUser] = useState({
		data: undefined,
		isAdmin: false,
	});

	useEffect(() => {
		return onAuthStateChanged(Auth, (user) => {
			setUser({
				data: user,
				isAdmin: false,
			});

			if (user) {
				const d = doc(FS, "users", user.uid);
				getDoc(d).then((snap) => {
					const data = snap.data();
					setUser((u) => ({ ...u, isAdmin: data?.isAdmin ?? false }));
				});
			}
		});
	}, []);

	return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}
