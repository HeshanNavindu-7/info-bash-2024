import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FS } from "../../../firebase.init";
import TeamView from "../../../Components/TeamView/TeamView";

function Teams() {
	const [teams, setTeams] = useState([]);

	useEffect(() => {
		const c = collection(FS, "teams");
		getDocs(query(c, where("status", "==", "approved"))).then((snap) => {
			setTeams(snap.docs.map((i) => ({ ...i.data(), id: i.id })));
		});
	}, []);

	return (
		<div className="teams">
			{teams.map((i) => (
				<TeamView key={i.id} data={i} />
			))}
		</div>
	);
}

export default Teams;
