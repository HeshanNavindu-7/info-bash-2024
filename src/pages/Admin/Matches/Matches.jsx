import { useRef } from "react";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { FS } from "../../../firebase.init";
import MatchesView from "./MatchesView";

function Matches() {
	const form = useRef();

	async function generateMatches() {
		const form_data = new FormData(form.current);

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
		for (let x in matches) {
			const match = matches[x];
			match.order = parseInt(x);
			addDoc(mc, match);
		}
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

	return (
		<div className="admin-matches">
			<form ref={form}>
				<div>
					<label htmlFor="overs">Overs count: </label>
					<input type="text" name="overs" id="overs" placeholder="Overs" />
				</div>
				<div>
					<label htmlFor="balls">Balls count: </label>
					<input type="text" name="balls" id="balls" placeholder="Balls per over" />
				</div>
				<button type="button" onClick={generateMatches}>
					Generate Round Matches
				</button>
			</form>

			<MatchesView />
		</div>
	);
}

export default Matches;
