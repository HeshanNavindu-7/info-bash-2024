import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { FS } from "../../../firebase.init";

function MatchEdit() {
	const { matchID } = useParams();
	const [data, setData] = useState({});
	const [teamA, setTeamA] = useState({});
	const [teamB, setTeamB] = useState({});
	const [selected, setSelected] = useState(null);

	useEffect(() => {
		const d = doc(FS, "matches", matchID);

		getDoc(d).then((snap) => {
			const data = snap.data();
			setData(data);

			const d1 = doc(FS, "teams", data.teamA);
			const d2 = doc(FS, "teams", data.teamB);

			getDoc(d1).then((s) => setTeamA(s.data()));
			getDoc(d2).then((s) => setTeamB(s.data()));
		});
	}, []);

	useEffect(() => {
		const d = doc(FS, "matches", matchID);

		return () => onSnapshot(d, (snap) => setData(snap.data()));
	}, []);

	return (
		<div>
			<div className="team-select">
				<h2>
					{data.type} {data.order}: <span style={{ color: "red" }}>{teamA.teamName}</span> vs{" "}
					<span style={{ color: "yellow" }}>{teamB.teamName}</span>
				</h2>
				<div onChange={(e) => setSelected(e.target.value)}>
					<div>
						<label htmlFor="team-1">{teamA.teamName}</label>
						<input value="team-1" type="radio" id="team-1" name="team" />
					</div>
					<div>
						<label htmlFor="team-2">{teamB.teamName}</label>
						<input value="team-2" type="radio" id="team-2" name="team" />
					</div>
				</div>
			</div>
			{selected === "team-1" && <AdminTeamMarks aorb="A" match={data} team={teamA} />}
			{selected === "team-2" && <AdminTeamMarks aorb="B" match={data} team={teamB} />}
		</div>
	);
}

function AdminTeamMarks({ match, team, aorb }) {
	const marks = match["marks" + aorb];
	const balls = match["balls" + aorb];
	const overs = Math.floor(balls / match.balls) + "." + (balls % match.balls);
	const run_rate = balls == 0 ? 0 : (marks / balls) * match.balls;

	return (
		<div>
			<div>Marks: {marks}</div>
			<div>Overs: {overs}</div>
			<div>Run Rate: {Math.round(run_rate * 100) / 100}</div>
		</div>
	);
}

export default MatchEdit;
