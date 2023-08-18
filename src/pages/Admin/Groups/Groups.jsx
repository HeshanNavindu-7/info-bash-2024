import { useEffect, useRef, useState } from "react";
import { FS } from "../../../firebase.init";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import GroupEdit from "./GroupEdit";

function shuffle(array) {
	let currentIndex = array.length,
		randomIndex;

	// While there remain elements to shuffle.
	while (currentIndex != 0) {
		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}

	return array;
}

function Groups() {
	const groupCount = useRef();
	const [groupList, setGroupList] = useState([]);
	const [teams, setTeams] = useState([]);
	const [dis, setDis] = useState(true);

	useEffect(() => {
		load();
	}, []);

	function load() {
		setDis(true);
		const gc = collection(FS, "groups");
		const tc = collection(FS, "teams");
		const tasks = [];
		tasks.push(
			getDocs(gc).then((snap) => {
				setGroupList(snap.docs.map((i) => ({ ...i.data(), id: i.id })));
			})
		);
		tasks.push(
			getDocs(query(tc, where("status", "==", "approved"))).then((snap) => {
				setTeams(snap.docs.map((i) => ({ ...i.data(), id: i.id })));
			})
		);
		Promise.all(tasks).finally(() => setDis(false));
	}

	async function generateGroups() {
		setDis(true);
		const count = parseInt(groupCount.current.value);
		const gc = collection(FS, "groups");

		const groups = [];
		for (let gi = 0; gi < count; gi++) {
			groups.push({ teams: [], groupName: "Group " + String.fromCharCode(97 + gi).toUpperCase() });
		}

		const shuffleTeams = shuffle(teams);

		for (let ti = 0; ti < shuffleTeams.length; ti++) {
			const team = shuffleTeams[ti];
			groups[ti % count]["teams"].push(team.id);
		}

		const tasks = [];
		for (let g of groups) {
			tasks.push(addDoc(gc, g));
		}
		Promise.all(tasks).finally(() => {
			load();
		});
	}

	return (
		<div>
			<div>
				<label htmlFor="group-count">Group Count</label>
				<input ref={groupCount} type="text" name="group-count" id="group-count" placeholder="Group count" />
				<button disabled={dis} onClick={generateGroups} type="button">
					Generate Groups
				</button>
			</div>
			<div>
				{groupList
					.sort((a, b) => a.groupName > b.groupName)
					.map((i) => (
						<GroupEdit key={i.id} teams={teams} data={i} />
					))}
			</div>
		</div>
	);
}

export default Groups;
