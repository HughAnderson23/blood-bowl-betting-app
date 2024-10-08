import React, { useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();  
  const [skulls, setSkulls] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [betAmount, setBetAmount] = useState(0);

  const fetchSkulls = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/user/skulls', {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      setSkulls(response.data.skulls);
    } catch (error) {
      console.error('Error fetching skulls:', error);
    }
  }, [setSkulls]);

  const handleLogout = () => {
    logout();
    navigate('/');  // Navigate to the home page after logout
  };

  const fetchMatches = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/matches');
      setMatches(response.data);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  }, [setMatches]);

  useEffect(() => {
    
    fetchSkulls();
    fetchMatches();
  }, [fetchSkulls, fetchMatches]); // Now including dependencies

  const handleBet = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/user/bets',
        { matchId: selectedMatch, team: selectedTeam, amount: betAmount },
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );
      alert(`Bet placed on ${selectedTeam} for ${betAmount} skulls!`);
      setSkulls(response.data.updatedSkulls);
    } catch (error) {
      console.error('Error placing bet:', error);
      alert('Failed to place bet.');
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, {user?.username}!</p>
      <p>You have {skulls} skulls.</p>
      <button onClick={handleLogout}>Logout</button>

      <h3>Place a Bet</h3>
      <select value={selectedMatch} onChange={(e) => setSelectedMatch(e.target.value)}>
        <option value="" disabled>Select a match</option>
        {matches.map((match) => (
          <option key={match._id} value={match._id}>
            {`${match.team1.name} (${match.oddsTeam1}) vs ${match.team2.name} (${match.oddsTeam2})`}
          </option>
        ))}
      </select>

      {selectedMatch && (
        <div>
          <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)}>
            <option value="" disabled>Select a team</option>
            {matches.find(match => match._id === selectedMatch)?.team1 && (
              <option value={matches.find(match => match._id === selectedMatch).team1._id}>
                {`${matches.find(match => match._id === selectedMatch).team1.name} - Odds: ${matches.find(match => match._id === selectedMatch).oddsTeam1}`}
              </option>
            )}
            {matches.find(match => match._id === selectedMatch)?.team2 && (
              <option value={matches.find(match => match._id === selectedMatch).team2._id}>
                {`${matches.find(match => match._id === selectedMatch).team2.name} - Odds: ${matches.find(match => match._id === selectedMatch).oddsTeam2}`}
              </option>
            )}
          </select>
        </div>
      )}

      <input
        type="number"
        value={betAmount}
        onChange={(e) => setBetAmount(e.target.value)}
        placeholder="Bet amount"
      />

      <button onClick={handleBet}>Place Bet</button>
    </div>
  );
};

export default Dashboard;

