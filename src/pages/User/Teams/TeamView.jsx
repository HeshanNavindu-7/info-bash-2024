import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TeamView from "../../../Components/TeamView/TeamView";
import { FS } from "../../../firebase.init";

function UserTeamView() {
	const { teamID } = useParams();
	const [data, setData] = useState({ players: [] });
	const navigate = useNavigate();

	useEffect(() => {
		const d = doc(FS, "teams", teamID);
		getDoc(d).then((snap) => {
			const t = snap.data();
			if (t === undefined) {
				navigate("/teams");
				return;
			}

			setData(t);
		});
	}, []);

	return <TeamView data={data} />;
}

export default UserTeamView;
