import { doc, getDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { App, FS } from "../../../firebase.init";
import { useNavigate } from "react-router-dom";

function MatchView({ data, isAdmin }) {
	const { teamA, teamB } = data;
	const [teamAData, setTeamAData] = useState({ img: "/images/info_bash-1.png" });
	const [teamBData, setTeamBData] = useState({ img: "/images/info_bash-1.png" });
	const navigate = useNavigate();
	let won = null;

	if (data.status == "Finished") {
		if (data.marksA > data.marksB) {
			won = "team-a";
		} else if (data.marksB > data.marksA) {
			won = "team-b";
		}
	}

	useEffect(() => {
		const da = doc(FS, "teams", teamA);
		const db = doc(FS, "teams", teamB);

		getDoc(da).then((snap) => {
			setTeamAData((a) => ({ ...a, ...snap.data() }));
		});

		getDoc(db).then((snap) => {
			setTeamBData((a) => ({ ...a, ...snap.data() }));
		});

		const ST = getStorage(App);
		const ra = ref(ST, "teams/" + teamA);
		const rb = ref(ST, "teams/" + teamB);

		getDownloadURL(ra)
			.then((img) => setTeamAData((a) => ({ ...a, img })))
			.catch(() => {});

		getDownloadURL(rb)
			.then((img) => setTeamBData((a) => ({ ...a, img })))
			.catch(() => {});
	}, []);

	return (
		<div
			onClick={() =>
				navigate((isAdmin === true ? "/admin" : "") + "/matches/" + data.id, {
					state: {
						teamAData,
						teamBData,
					},
				})
			}
			className="match-view"
		>
			<div className={"team" + (won == "team-b" ? " lost-team" : "")}>
				<span>{teamAData.teamName}</span>
				<br />
				<img width={100} src={teamAData.img} alt="" />
			</div>
			<div className="vs">
				<span>{data.type}</span>
				<img src="/images/vs.png" alt="" width={100} />
				<span className={data.status.toLowerCase().replace(/\s/, "-")}>{data.status}</span>
			</div>
			<div className={"team" + (won == "team-a" ? " lost-team" : "")}>
				<span>{teamBData.teamName}</span>
				<br />
				<img width={100} src={teamBData.img} alt="" />
			</div>
		</div>
	);
}

export default MatchView;
