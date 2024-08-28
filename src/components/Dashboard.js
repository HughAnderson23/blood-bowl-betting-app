import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [skulls, setSkulls] = useState(0);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [betAmount, setBetAmount] = useState(0);

  useEffect(() => {
    // Fetch user's skull count
    const fetchSkulls = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user/skulls', {
          headers: { 'x-auth-token': localStorage.getItem('token') },
        });
        setSkulls(response.data.skulls);
      } catch (error) {
        console.error('Error fetching skulls:', error);
      }
    };

    // Fetch teams for betting
    const fetchTeams = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user/teams');
        setTeams(response.data);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchSkulls();
    fetchTeams();
  }, []);

  const handleBet = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/user/bets',
        { team: selectedTeam, amount: betAmount },
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
      <button onClick={logout}>Logout</button>

      <h3>Place a Bet</h3>
      <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)}>
        <option value="" disabled>Select a team</option>
        {teams.map((team) => (
          <option key={team._id} value={team.name}>
            {team.name}
          </option>
        ))}
      </select>

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
