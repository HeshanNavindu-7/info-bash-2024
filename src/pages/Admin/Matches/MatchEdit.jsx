import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteDoc, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { FS } from "../../../firebase.init";
import "./Match.scss";

function MatchEdit() {
	const { matchID } = useParams();
	const [data, setData] = useState({});
	const [teamA, setTeamA] = useState({});
	const [teamB, setTeamB] = useState({});
	const [selected, setSelected] = useState(null);
	const [dis, setDis] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const d = doc(FS, "matches", matchID);

		getDoc(d).then((snap) => {
			const data = snap.data();
			setData({ ...data, id: snap.id });

			const d1 = doc(FS, "teams", data.teamA);
			const d2 = doc(FS, "teams", data.teamB);

			getDoc(d1).then((s) => setTeamA(s.data()));
			getDoc(d2).then((s) => setTeamB(s.data()));
		});
	}, []);

	useEffect(() => {
		const d = doc(FS, "matches", matchID);

		return () => onSnapshot(d, (snap) => setData({ ...snap.data(), id: snap.id }));
	}, []);

	function statusUpdate(s) {
		setDis(true);
		const d = doc(FS, "matches", data.id);

		updateDoc(d, {
			status: s,
		}).then((_) => setDis(false));
	}

	return (
		<div className="match-edit">
			<div className="team-select">
				<h2>
					{data.type} {data.order}: <span style={{ color: "red" }}>{teamA.teamName}</span> vs{" "}
					<span style={{ color: "yellow" }}>{teamB.teamName}</span>
				</h2>
				<h3>Status: {data.status}</h3>
				<div className="status-update update">
					<h2>Status Update</h2>
					<button disabled={dis} onClick={() => statusUpdate("Not Started")}>
						Not Started
					</button>
					<button disabled={dis} onClick={() => statusUpdate("Playing")}>
						Playing
					</button>
					<button disabled={dis} onClick={() => statusUpdate("Finished")}>
						Finished
					</button>
					<button disabled={dis} onClick={() => statusUpdate("Paused")}>
						Paused
					</button>
					<button
						onClick={() => {
							if (confirm("Sure to delete?"))
								deleteDoc(doc(FS, "matches", data.id)).then(() => {
									navigate("/admin/matches");
								});
						}}
					>
						Delete Match
					</button>
				</div>
				<br />
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
	const wickets = match["wickets" + aorb];
	const overs = Math.floor(balls / match.balls) + "." + (balls % match.balls);
	const run_rate = balls == 0 ? 0 : (marks / balls) * match.balls;
	const [dis, setDis] = useState(false);
	const d = doc(FS, "matches", match.id);

	const marksRef = useRef();
	const oversRef = useRef();
	const wicketsRef = useRef();

	useEffect(() => {
		marksRef.current.value = marks;
		oversRef.current.value = overs;
		wicketsRef.current.value = wickets;
	});

	function addMarks(m) {
		setDis(true);

		if (aorb == "A") {
			updateDoc(d, {
				marksA: marks + m,
			}).then((_) => setDis(false));
		} else {
			updateDoc(d, {
				marksB: marks + m,
			}).then((_) => setDis(false));
		}
	}

	function addballs(b) {
		setDis(true);

		if (aorb == "A") {
			updateDoc(d, {
				ballsA: balls + b,
			}).then((_) => setDis(false));
		} else {
			updateDoc(d, {
				ballsB: balls + b,
			}).then((_) => setDis(false));
		}
	}

	function addWickets(w) {
		setDis(true);

		if (aorb == "A") {
			updateDoc(d, {
				wicketsA: wickets + w,
			}).then((_) => setDis(false));
		} else {
			updateDoc(d, {
				wicketsB: wickets + w,
			}).then((_) => setDis(false));
		}
	}

	function updateMarks() {
		const marks = parseInt(marksRef.current.value);
		setDis(true);

		if (aorb == "A") {
			updateDoc(d, {
				marksA: marks,
			}).then((_) => setDis(false));
		} else {
			updateDoc(d, {
				marksB: marks,
			}).then((_) => setDis(false));
		}
	}

	function updateWickets() {
		const wickets = parseInt(wicketsRef.current.value);
		setDis(true);

		if (aorb == "A") {
			updateDoc(d, {
				wicketsA: wickets,
			}).then((_) => setDis(false));
		} else {
			updateDoc(d, {
				wicketsB: wickets,
			}).then((_) => setDis(false));
		}
	}

	function updateOvers() {
		const overs = oversRef.current.value;
		setDis(true);

		const po = parseInt(overs);
		const pb = parseInt(overs.replace(/.*\./, ""));

		const bc = po * match.balls + pb;

		if (aorb == "A") {
			updateDoc(d, {
				ballsA: bc,
			}).then((_) => setDis(false));
		} else {
			updateDoc(d, {
				ballsB: bc,
			}).then((_) => setDis(false));
		}
	}

	return (
		<div>
			<div>Marks: {marks}</div>
			<div>Overs: {overs}</div>
			<div>Wickets: {wickets}</div>
			<div>Run Rate: {Math.round(run_rate * 100) / 100}</div>
			<hr />
			<div className="marks-update update">
				<h2>Marks Update</h2>
				<button onClick={() => addMarks(-1)} type="button" disabled={dis}>
					- 1
				</button>
				<button onClick={() => addMarks(1)} type="button" disabled={dis}>
					+ 1
				</button>
				<button onClick={() => addMarks(2)} type="button" disabled={dis}>
					+ 2
				</button>
				<button onClick={() => addMarks(3)} type="button" disabled={dis}>
					+ 3
				</button>
				<button onClick={() => addMarks(4)} type="button" disabled={dis}>
					+ 4
				</button>
				<button onClick={() => addMarks(6)} type="button" disabled={dis}>
					+ 6
				</button>
				<input disabled={dis} type="text" ref={marksRef} name="mark" id="mark" />
				<button onClick={updateMarks} type="button" disabled={dis}>
					Update
				</button>
			</div>
			<hr />
			<div className="balls-update update">
				<h2>Balls Update</h2>
				<button onClick={() => addballs(1)} type="button" disabled={dis}>
					+ 1
				</button>
				<button onClick={() => addballs(-1)} type="button" disabled={dis}>
					- 1
				</button>
				<input ref={oversRef} disabled={dis} type="text" name="balls" id="balls" />
				<button onClick={updateOvers} type="button" disabled={dis}>
					Update
				</button>
			</div>
			<hr />
			<div className="wickets-update update">
				<h2>Wickets Update</h2>
				<button onClick={() => addWickets(1)} type="button" disabled={dis}>
					+ 1
				</button>
				<button onClick={() => addWickets(-1)} type="button" disabled={dis}>
					- 1
				</button>
				<input ref={wicketsRef} disabled={dis} type="text" name="wicket" id="wicket" />
				<button onClick={updateWickets} type="button" disabled={dis}>
					Update
				</button>
			</div>
			<br />
			<br />
		</div>
	);
}

export default MatchEdit;
