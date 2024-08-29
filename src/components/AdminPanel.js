import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
    const [matches, setMatches] = useState([]);
    const [team1Id, setTeam1Id] = useState('');
    const [team2Id, setTeam2Id] = useState('');
    const [date, setDate] = useState('');
    const [week, setWeek] = useState('');

    useEffect(() => {
        fetchMatches();
    }, []);

    const fetchMatches = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/matches');
            setMatches(response.data);
        } catch (error) {
            console.error('Error fetching matches:', error);
        }
    };

    const handleCreateMatch = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/matches', {
                team1Id, team2Id, date, week
            });
            setMatches([...matches, response.data]);
            alert('New match created successfully!');
        } catch (error) {
            console.error('Error creating match:', error);
            alert('Failed to create match.');
        }
    };

    const lockInBets = async (matchId) => {
        try {
            await axios.post(`http://localhost:5000/api/matches/lock/${matchId}`);
            alert('Bets locked for match ' + matchId);
            setMatches(matches.map(match => match._id === matchId ? { ...match, isLocked: true } : match));
        } catch (error) {
            console.error('Error locking bets:', error);
        }
    };

    const resolveMatch = async (matchId, winningTeamId) => {
        try {
            await axios.post(`http://localhost:5000/api/matches/resolve/${matchId}`, { winningTeamId });
            alert('Winnings awarded for match ' + matchId);
        } catch (error) {
            console.error('Error resolving match:', error);
        }
    };

    return (
        <div>
            <h1>Admin Panel</h1>
            <form onSubmit={handleCreateMatch}>
                <input type="text" placeholder="Team 1 ID" value={team1Id} onChange={e => setTeam1Id(e.target.value)} required />
                <input type="text" placeholder="Team 2 ID" value={team2Id} onChange={e => setTeam2Id(e.target.value)} required />
                <input type="date" placeholder="Match Date" value={date} onChange={e => setDate(e.target.value)} required />
                <input type="number" placeholder="Week Number" value={week} onChange={e => setWeek(e.target.value)} required />
                <button type="submit">Create Match</button>
            </form>
            <ul>
                {matches.map(match => (
                    <li key={match._id}>
                        Match: {match.team1.name} vs {match.team2.name} - Week {match.week}
                        {!match.isLocked && <button onClick={() => lockInBets(match._id)}>Lock In Bets</button>}
                        <button onClick={() => resolveMatch(match._id, match.team1._id)}>Win Team 1</button>
                        <button onClick={() => resolveMatch(match._id, match.team2._id)}>Win Team 2</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminPanel;

