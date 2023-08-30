import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TeamView from "../../../Components/TeamView/TeamView";
import { FS } from "../../../firebase.init";
import "../../../Components/TeamView/TeamView.scss";

function UserTeamView() {
	const { teamID } = useParams();
	const [data, setData] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const d = doc(FS, "teams", teamID);
		getDoc(d).then((snap) => {
			const t = snap.data();
			if (t === undefined) {
				navigate("/teams");
				return;
			}
			setData({ ...t, id: snap.id });
		});
	}, []);

	if (data === null) return "";
	return (
		<div style={{display: "flex", justifyContent: "center"}}>
			<TeamView data={data} />
		</div>
	);
}

export default UserTeamView;
