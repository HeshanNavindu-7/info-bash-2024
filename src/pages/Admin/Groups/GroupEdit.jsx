function GroupEdit({ data, teams }) {
	function getTeam(id) {
		return teams.filter((i) => i.id === id)[0] ?? {};
	}

	return (
		<div>
			<h2>{data.groupName}</h2>
			<p>Teams</p>
			<ul>
				{data.teams.map((i, k) => (
					<li key={k}>{getTeam(i).teamName}</li>
				))}
			</ul>
		</div>
	);
}

export default GroupEdit;
