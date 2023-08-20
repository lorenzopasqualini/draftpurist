/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import {
	ResponsiveContainer,
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

interface TeamXGData {
	team: string;
	AxG: number; // You should replace 'number' with the correct data type for AxG
}

const App: React.FC = () => {
	const [teamXG, setTeamXG] = useState<TeamXGData[]>([]);
	const [jsonFile, setJsonFile] = useState('10');

	const fetchData = async (file: any) => {
		try {
			const response = await fetch(
				`https://raw.githubusercontent.com/statsbomb/open-data/master/data/events/37541${file}.json`
			);
			const jsonData = await response.json();

			const xG = jsonData.reduce((acc: any, event: any) => {
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
				AxG: Number(AxG),
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
			<div className="flex justify-end mx-8 my-4 md:m-4">
				<ModeToggle />
			</div>

			<div className="flex flex-col items-center m-8">
				<Card className="w-full md:w-3/4 lg:w-2/3">
					<CardHeader>
						<CardTitle>DRAFTPURIST - Expected Goals (xG) Accumulator</CardTitle>
						<CardDescription>
							Pair 2 English teams and see how much expected goals they had when
							facing each another
						</CardDescription>
					</CardHeader>

					<CardContent>
						{/* Examples: 24-35-52-58 */}
						<label htmlFor="jsonFile" className="font-mono text-sm pb-2">
							Type a number from 01-99 for a PL 15/16 match
						</label>
						<Input
							type="text"
							value={jsonFile}
							onChange={(e) => setJsonFile(e.target.value)}
						/>
						<div className="my-8 flex justify-center">
							<ResponsiveContainer width="100%" height={500}>
								<BarChart data={teamXG}>
									<CartesianGrid strokeDasharray="6 6" stroke="gray" />
									<XAxis dataKey="team" />
									<YAxis />
									<Tooltip wrapperStyle={{ color: '#fc6504' }} />
									<Legend />
									<Bar dataKey="AxG" fill="#fc6504" barSize={50} />
								</BarChart>
							</ResponsiveContainer>
						</div>
					</CardContent>

					<CardFooter>
						<img src="/sb.svg" alt="statsbomb" width="100" height="50" />
					</CardFooter>
				</Card>
			</div>

			<Footer />
		</ThemeProvider>
	);
};

export default App;
