import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { App, FS } from "../../../firebase.init";
import { getDownloadURL, getStorage, ref } from "firebase/storage";

function TeamView() {
	const { teamID } = useParams();
	const [data, setData] = useState({ players: [] });
	const [img, setImg] = useState(null);
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

		const Storage = getStorage(App);
		getDownloadURL(ref(Storage, "teams/" + teamID))
			.then(setImg)
			.catch(() => setImg("/images/info_bash-1.png"));
	}, []);

	return (
		<div className="team-view">
			<h2>Name: {data.teamName}</h2>
			<div>
				<img width="100" src={img} alt="" />
			</div>
			<p>Players</p>
			<ul>
				{data.players.map((i, k) => (
					<li key={k}>{i}</li>
				))}
			</ul>
		</div>
	);
}

export default TeamView;
