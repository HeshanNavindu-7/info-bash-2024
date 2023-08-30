import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { uploadBytes, ref, getStorage } from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import { useUser } from "../../../Hooks/useUser";
import { App, Auth, FS } from "../../../firebase.init";
import { useNavigate } from "react-router-dom";
import "./TeamRegister.scss";

const provider = new GoogleAuthProvider();

function TeamRegister() {
	const user = useUser();

	return (
		<div className="team-register">
			{user.data === null && <ConnectWithGoogle />}
			{user.data !== undefined && user.data !== null && <TeamData />}
		</div>
	);
}

function ConnectWithGoogle() {
	function signIn() {
		signInWithPopup(Auth, provider);
	}

	return (
		<div className="google-connect">
			<div className="container">
				<div className="title">
					<h1>Connect with Google to register your team</h1>
				</div>
				<div onClick={signIn} className="google-btn">
					<div className="google-icon-wrapper">
						<img
							className="google-icon"
							src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
						/>
					</div>
					<p className="btn-text">
						<b>Sign in with google</b>
					</p>
				</div>
			</div>
		</div>
	);
}

function TeamData() {
	const [players, setPlayers] = useState([]);
	const inp = useRef(null);
	const form = useRef(null);
	const [dis, setDis] = useState(true);
	const [err, setErr] = useState(null);
	const user = useUser();
	const navigate = useNavigate();

	function addPlayer() {
		const p_name = inp.current.value.trim().replace(/\s+/g, " ");
		if (p_name.length <= 1) return alert("Invalid player name: " + p_name);
		setPlayers((p) => [...p, p_name]);
		inp.current.value = "";
	}

	function removePlayer(playerID) {
		setPlayers((p) => p.filter((i, k) => k !== playerID));
	}

	function register(e) {
		e.preventDefault();

		const form_data = new FormData(form.current);
		const d = doc(FS, "teams", user.data.uid);
		setDis(true);
		setErr(null);

		let teamName = form_data.get("team-name");
		teamName = teamName.trim().replace(/\s+/g, " ");

		if (teamName.length < 3) {
			setDis(false);
			setErr("Team name should contain at least 3 characters.");
			return;
		}

		if (players.length < 10) {
			setDis(false);
			setErr("Minimum player count is 10");
			return;
		}

		const tasks = [];

		const file = form_data.get("team-logo");
		if (file.size !== 0) {
			if (file.size >= 1024 * 1024) {
				setDis(false);
				setErr("Team logo is larger than 1MB");
				return;
			}

			const Storage = getStorage(App);
			const r = ref(Storage, "teams/" + user.data.uid);

			tasks.push(uploadBytes(r, file));
		}

		tasks.push(
			setDoc(d, {
				teamName: form_data.get("team-name"),
				players,
				status: "pending",
			})
		);

		Promise.all(tasks).then(() => navigate("/teams/" + user.data.uid));
	}

	useEffect(() => {
		const d = doc(FS, "teams", user.data.uid);
		getDoc(d).then((snap) => {
			if (snap.data() !== undefined) navigate("/teams/" + user.data.uid);
			else setDis(false);
		});
	}, []);

	return (
		<div className="team-data">
			<form ref={form} onSubmit={register}>
				<div className="form-group">
					<label htmlFor="team-name">Team Name</label>
					<input autoComplete="off" type="text" name="team-name" id="team-name" placeholder="Team Name" />
				</div>
				<div className="form-group">
					<label htmlFor="team-logo">Team Logo</label>
					<input type="file" accept="image/*" name="team-logo" id="team-logo" />
				</div>
				<div className="form-group">
					<label htmlFor="player-name">Players List</label>
					<input
						autoComplete="off"
						ref={inp}
						type="text"
						name="player-name"
						id="player-name"
						placeholder="Player Name"
					/>
					<button className="btn-add-player" onClick={addPlayer} type="button">
						Add Player
					</button>
				</div>
				<div className="form-group">
					<table>
						<tbody>
							{players.map((i, k) => (
								<tr key={k}>
									<td>{i}</td>
									<td width={50}>
										<span className="close-btn" type="button" onClick={removePlayer.bind(undefined, k)}>
											x
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<div hidden={err === null} className="error">
					{err}
				</div>
				<div className="form-group btn-holder">
					<button className="btn" disabled={dis} type="submit">
						Register
					</button>
				</div>
			</form>
		</div>
	);
}

export default TeamRegister;
