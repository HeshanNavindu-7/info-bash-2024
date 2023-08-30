import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FS } from "../../../firebase.init";
import { NavLink } from "react-router-dom";
import MatchView from "../../User/Matches/MatchView";

function MatchesView({ render }) {
	const [matches, setMatches] = useState([]);

	useEffect(() => {
		const mc = collection(FS, "matches");
		getDocs(query(mc, orderBy("order"))).then((snap) => setMatches(snap.docs.map((i) => ({ ...i.data(), id: i.id }))));
	}, [render]);

	return (
		<div className="user-matches">
			{matches.map((i) => (
				<MatchView key={i.id} isAdmin={true} data={i} />
			))}
		</div>
	);
}

function MatchViews({ data }) {
	const [t1, setT1] = useState({});
	const [t2, setT2] = useState({});

	useEffect(() => {
		const d1 = doc(FS, "teams", data.teamA);
		const d2 = doc(FS, "teams", data.teamB);

		getDoc(d1).then((snap) => {
			setT1(snap.data());
		});

		getDoc(d2).then((snap) => {
			setT2(snap.data());
		});
	}, []);

	return (
		<NavLink to={"/admin/matches/" + data.id} style={{ textDecoration: "none", color: "white" }}>
			<div>
				<h2>{data.groupName}</h2>
				<p>
					{t1.teamName} vs {t2.teamName}
				</p>
			</div>
		</NavLink>
	);
}

export default MatchesView;
