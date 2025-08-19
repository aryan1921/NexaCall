import React, { useState } from 'react';
import withAuth from '../utils/withAuth';
import { useNavigate } from 'react-router-dom';
import "../App.css";
import { Button, IconButton, TextField } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import { removeToken } from '../utils/auth';
import authService from '../services/auth.service';   // ✅ use axios-based service

function HomeComponent() {
  const navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleJoinVideoCall = async () => {
    if (!meetingCode.trim()) {
      setError("Please enter a meeting code");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const result = await authService.addToUserHistory(meetingCode.trim());
      if (!result.success) {
        console.error("Failed to add to history:", result.error);
        setError(result.error);
        return;
      }
      navigate(`/${meetingCode.trim()}`);
    } catch (err) {
      console.error("Failed to add to history", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    removeToken();  // removes 'jwt_token'
    navigate("/auth");
  };

  return (
    <>
      {loading && (
        <div style={{
          position:'fixed', inset:0, background:'rgba(0,0,0,0.3)',
          zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center'
        }}>
          <h2 style={{ color:'white' }}>Loading…</h2>
        </div>
      )}

      <div className="navBar">
        <div style={{ display:"flex", alignItems:"center" }}>
          <h2>Connect Through LiveLink</h2>
        </div>
        <div style={{ display:"flex", alignItems:"center" }}>
          <IconButton onClick={() => navigate("/history")}>
            <RestoreIcon />
          </IconButton>
          <p>History</p>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </div>

      <div className="meetContainer">
        <div className="leftPanel">
          <div>
            <h2>Enter Meeting Code</h2>
            <div style={{ display:'flex', gap:"10px" }}>
              <TextField
                onChange={e => setMeetingCode(e.target.value)}
                value={meetingCode}
                label="Meeting Code"
                variant="outlined"
              />
              <Button onClick={handleJoinVideoCall} variant='contained'>
                Join
              </Button>
            </div>
            {error && <p style={{ color:"red", marginTop:"10px" }}>{error}</p>}
          </div>
        </div>
        <div className='rightPanel'>
          <img srcSet='/logo3.png' alt="" />
        </div>
      </div>
    </>
  );
}

export default withAuth(HomeComponent);
