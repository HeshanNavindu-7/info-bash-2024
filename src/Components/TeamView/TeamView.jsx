import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { App } from "../../firebase.init";
import "./TeamView.scss";

function TeamView({ data }) {
	const [img, setImg] = useState(null);
	useEffect(() => {
		const Storage = getStorage(App);
		getDownloadURL(ref(Storage, "teams/" + data.id))
			.then(setImg)
			.catch(() => setImg("/images/info_bash-1.png"));
	}, []);

	return (
		<div className="team-view">
			<div>
				<h2>{data.teamName}</h2>
				<img width="100" src={img} alt="" />
			</div>
			<div>
				<p>Players</p>
				<ul>
					{data.players.map((i, k) => (
						<li key={k}>{i}</li>
					))}
				</ul>
			</div>
		</div>
	);
}

export default TeamView;
