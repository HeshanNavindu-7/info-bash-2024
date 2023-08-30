import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { FS } from "../../../firebase.init";
import "./Matches.scss";

function MatchLive() {
	const { matchID } = useParams();
	const [match, setMatch] = useState({});
	const location = useLocation();

	if (location.state == null) return <Navigate to="/matches" />;

	const { teamAData, teamBData } = location.state;
	const oversA = Math.floor(match.ballsA / match.balls) + "." + (match.ballsA % match.balls);
	const oversB = Math.floor(match.ballsB / match.balls) + "." + (match.ballsB % match.balls);

	useEffect(() => {
		const d = doc(FS, "matches", matchID);
		return onSnapshot(d, (snap) => {
			setMatch(snap.data());
		});
	}, []);

	return (
		<div className="live-match">
			<div className="content">
				<div className="team">
					<img width={100} src={teamAData.img} alt="" />
					<div className="data">
						<h2>{teamAData.teamName}</h2>
						<p className="runs">Runs: {match.marksA}</p>
						<p className="overs">Overs: {oversA}</p>
						<p className="wickets">Wickets: {match.wicketsA}</p>
					</div>
				</div>
				<div className="vs">
					<img width={50} src="/images/vs.png" alt="" />
				</div>
				<div className="team">
					<img width={100} src={teamBData.img} alt="" />
					<div className="data">
						<h2>{teamBData.teamName}</h2>
						<p className="runs">Runs: {match.marksB}</p>
						<p className="overs">Overs: {oversB}</p>
						<p className="wickets">Wickets: {match.wicketsB}</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default MatchLive;
