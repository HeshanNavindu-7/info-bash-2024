import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { App, FS } from "../../firebase.init";
import "./TeamView.scss";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";

function TeamView({ data, admin }) {
	const [img, setImg] = useState(null);
	const [appDis, setAppDis] = useState(false);

	useEffect(() => {
		const Storage = getStorage(App);
		getDownloadURL(ref(Storage, "teams/" + data.id))
			.then(setImg)
			.catch(() => setImg("/images/info_bash-1.png"));
	}, []);

	function deleteTeam(team_id) {
		setAppDis(true);
		const d = doc(FS, "teams", team_id);
		deleteDoc(d)
			.then(() => location.reload())
			.finally(() => setAppDis(false));
	}

	function approve(team_id) {
		setAppDis(true);
		const d = doc(FS, "teams", team_id);
		updateDoc(d, {
			status: "approved",
		})
			.then(() => {
				data.status = "approved";
			})
			.finally(() => setAppDis(false));
	}

	return (
		<div className="team-view">
			<div>
				<h2>{data.teamName}</h2>
				<img width="100" src={img} alt="" />
			</div>
			<div>
				<ul>
					{data.players.map((i, k) => (
						<li key={k}>{i}</li>
					))}
				</ul>
			</div>

			{admin === true && (
				<div>
					{data.status === "pending" && (
						<button disabled={appDis} onClick={() => approve(data.id)}>
							Approve
						</button>
					)}
					{data.status === "approved" && (
						<button disabled={appDis} onClick={() => deleteTeam(data.id)}>
							Delete
						</button>
					)}
				</div>
			)}
		</div>
	);
}

export default TeamView;
