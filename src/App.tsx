import React, { useEffect, useState } from 'react';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
} from 'recharts';

const App: React.FC = () => {
	const [teamXG, setTeamXG] = useState([]);
	const [jsonFile, setJsonFile] = useState('3754125');

	const fetchData = async (file) => {
		try {
			const response = await fetch(
				`https://raw.githubusercontent.com/statsbomb/open-data/master/data/events/${file}.json`
			);
			const jsonData = await response.json();

			const xG = jsonData.reduce((acc, event) => {
				if (event.shot) {
					const teamName = event.team.name;
					const xG = event.shot.statsbomb_xg;

					if (!acc[teamName]) {
						acc[teamName] = 0;
					}

					acc[teamName] += xG;
				}
				return acc;
			}, {});

			const data = Object.entries(xG).map(([teamName, accumulatedXG]) => ({
				team: teamName,
				accumulatedXG,
			}));

			setTeamXG(data);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		fetchData(jsonFile);
	}, [jsonFile]);

	return (
		<div>
			<h1 className="text-4xl">Accumulated xG</h1>
			<div>
				<label htmlFor="jsonFile">Game number: </label>
				<input
					type="text"
					value={jsonFile}
					onChange={(e) => setJsonFile(e.target.value)}
				/>
			</div>
			<BarChart width={400} height={600} data={teamXG}>
				<CartesianGrid strokeDasharray="2 2" />
				<XAxis dataKey="team" />
				<YAxis />
				<Tooltip />
				<Legend />
				<Bar dataKey="accumulatedXG" fill="cornflowerblue" />
			</BarChart>
		</div>
	);
};

export default App;
