import { useRef, useState } from "react";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { FS } from "../../../firebase.init";
import MatchesView from "./MatchesView";

function Matches() {
	const form = useRef();
	const cusForm = useRef();
	const [dis, setDis] = useState(false);

	async function generateMatches() {
		const form_data = new FormData(form.current);
		setDis(true);

		const overs = parseInt(form_data.get("overs"));
		const balls = parseInt(form_data.get("balls"));

		const c = collection(FS, "groups");
		const mc = collection(FS, "matches");

		const groups = await getDocs(c);
		let matches = [];
		let team_count = 0;

		groups.forEach((group) => {
			const group_data = group.data();
			team_count = Math.max(team_count, group_data.teams.length);

			for (let x in group_data.teams) {
				const teamA = group_data.teams[x];

				for (let y = parseInt(x) + 1; y < group_data.teams.length; y++) {
					const teamB = group_data.teams[y];
					matches.push({
						groupName: group_data.groupName,
						teamA,
						teamB,
						teams: [teamA, teamB],
						overs,
						balls,
						type: "Round Match",
						marksA: 0,
						ballsA: 0,
						wicketsA: 0,
						marksB: 0,
						ballsB: 0,
						wicketsB: 0,
						status: "Not Started",
					});
				}
			}
		});
		matches = shuffleMatches(matches, groups.docs.length, team_count);
		const tasks = [];
		for (let x in matches) {
			const match = matches[x];
			match.order = parseInt(x);
			tasks.push(addDoc(mc, match));
		}
		Promise.all(tasks).then((_) => setDis(false));
	}

	function shuffleMatches(matches, group_count, team_count) {
		const shuffled = [];
		for (let t = 0; t < team_count; t++) {
			for (let g = 0; g < group_count; g++) {
				shuffled.push(matches[g * team_count + t]);
			}
		}
		return shuffled;
	}

	async function createCustomMatch() {
		const form_data = new FormData(cusForm.current);
		setDis(true);

		const overs = parseInt(form_data.get("custom-overs"));
		const balls = parseInt(form_data.get("custom-balls"));

		const teamA = form_data.get("team-a");
		const teamB = form_data.get("team-b");
		const type = form_data.get("match-type");

		const mc = collection(FS, "matches");
		const mdocs = await getDocs(mc);

		await addDoc(mc, {
			teamA,
			teamB,
			teams: [teamA, teamB],
			overs,
			balls,
			type,
			marksA: 0,
			ballsA: 0,
			wicketsA: 0,
			marksB: 0,
			ballsB: 0,
			wicketsB: 0,
			status: "Not Started",
			order: mdocs.size,
		});
		setDis(false);
	}

	return (
		<div className="admin-matches">
			<div className="round-matches">
				<h2>Round Matches</h2>
				<form ref={form}>
					<div>
						<label htmlFor="overs">Overs count: </label>
						<input type="text" name="overs" id="overs" placeholder="Overs" />
					</div>
					<div>
						<label htmlFor="balls">Balls count: </label>
						<input type="text" name="balls" id="balls" placeholder="Balls per over" />
					</div>
					<button disabled={dis} type="button" onClick={generateMatches}>
						Generate Round Matches
					</button>
				</form>
			</div>
			<hr />

			<div className="custom-match">
				<h2>Custom Match</h2>
				<form ref={cusForm}>
					<div>
						<label htmlFor="custom-overs">Overs count: </label>
						<input placeholder="Overs" type="text" name="custom-over" id="custom-overs" />
					</div>
					<div>
						<label htmlFor="custom-balls">Balls count: </label>
						<input placeholder="Balls per over" type="text" name="custom-balls" id="custom-balls" />
					</div>
					<div>
						<label htmlFor="match-type-r">Round Match</label>
						<input value="Round Match" defaultChecked type="radio" name="match-type" id="match-type-r" />
					</div>
					<div>
						<label htmlFor="match-type-s">Semi Final</label>
						<input value="Semi Final" type="radio" name="match-type" id="match-type-s" />
					</div>
					<div>
						<label htmlFor="match-type-f">Final</label>
						<input value="Final" type="radio" name="match-type" id="match-type-f" />
					</div>
					<div>
						<input placeholder="Team A" type="text" name="team-a" id="team-a" />
						<input placeholder="Team B" type="text" name="team-b" id="team-b" />
					</div>
					<div>
						<button disabled={dis} type="button" onClick={createCustomMatch}>
							Create Custom Match
						</button>
					</div>
				</form>
			</div>
			<hr />

			<MatchesView render={dis} />
		</div>
	);
}

export default Matches;
