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
import { ThemeProvider } from '@/components/theme-provider';
import { Input } from '@/components/ui/input';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import Footer from './components/footer';
import { ModeToggle } from './components/mode-toggle';

const App: React.FC = () => {
	const [teamXG, setTeamXG] = useState([]);
	const [jsonFile, setJsonFile] = useState('110');

	const fetchData = async (file) => {
		try {
			const response = await fetch(
				`https://raw.githubusercontent.com/statsbomb/open-data/master/data/events/3754${file}.json`
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

			const data = Object.entries(xG).map(([teamName, AxG]) => ({
				team: teamName,
				AxG,
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
		<ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
			<div className="flex justify-end m-2">
				<ModeToggle />
			</div>

			<div className="flex justify-center m-8">
				<Card>
					<CardHeader>
						<CardTitle>DRAFTPURIST - Expected Goals (xG) Accumulator</CardTitle>
						<CardDescription>
							Pair 2 English teams and see how much expected goals they had when
							faced one another
						</CardDescription>
					</CardHeader>

					<CardContent>
						<p className="font-mono text-sm pb-2">
							Type a number for a PL match
						</p>
						<Input
							type="text"
							value={jsonFile}
							onChange={(e) => setJsonFile(e.target.value)}
						/>

						<div className="my-8">
							<BarChart width={600} height={600} data={teamXG}>
								<CartesianGrid strokeDasharray="6 6" stroke="gray" />
								<XAxis dataKey="team" />
								<YAxis />
								<Tooltip wrapperStyle={{ color: 'cornflowerblue' }} />
								<Legend />
								<Bar dataKey="AxG" fill="cornflowerblue" barSize={60} />
							</BarChart>
						</div>
					</CardContent>

					<CardFooter>
						<img src="/sb.svg" width="100" height="50" />
					</CardFooter>
				</Card>
			</div>

			<Footer />
		</ThemeProvider>
	);
};

export default App;
