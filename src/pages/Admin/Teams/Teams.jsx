import { useEffect, useState } from "react";
import { App, FS } from "../../../firebase.init";
import { collection, getDocs } from "firebase/firestore";
import TeamView from "../../../Components/TeamView/TeamView";

function Teams() {
	const [teams, setTeams] = useState([]);

	useEffect(() => {
		const c = collection(FS, "teams");
		getDocs(c).then((snap) => {
			setTeams(snap.docs.map((i) => ({ ...i.data(), id: i.id })));
		});
	}, []);

	return (
		<div>
			<h2>Teams</h2>
			{teams.map((i) => (
				<TeamView key={i.id} data={i} admin={true} />
			))}
		</div>
	);
}

export default Teams;
