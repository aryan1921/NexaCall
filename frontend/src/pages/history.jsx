import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import withAuth from '../utils/withAuth';
import authService from '../services/auth.service';

import {
  Card,
  CardContent,
  Button,
  Typography,
  Snackbar,
  Alert,
  IconButton,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

function History() {
  const [meetings, setMeetings] = useState([]);
  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const result = await authService.getHistoryOfUser();
        if (mounted) {
          if (result.success) {
            setMeetings(Array.isArray(result.history) ? result.history : []);
          } else {
            setSnackbarMessage(result.error || 'Failed to fetch history');
            setOpen(true);
          }
        }
      } catch (e) {
        if (mounted) {
          setSnackbarMessage('Failed to fetch history');
          setOpen(true);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  return (
    <div style={{ maxWidth: 720, margin: '24px auto', padding: '0 12px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 16,
        }}
      >
        <IconButton onClick={() => navigate('/home')}>
          <HomeIcon />
        </IconButton>
        <Typography variant="h6">Meeting History</Typography>
      </div>

      {meetings.length === 0 ? (
        <Typography color="text.secondary">No meetings found.</Typography>
      ) : (
        meetings.map((m, idx) => (
          <Card
            key={`${m.meetingCode}-${idx}`}
            variant="outlined"
            sx={{ mb: 2 }}
          >
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Code: {m.meetingCode}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Date: {formatDate(m.date)}
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate(`/${m.meetingCode}`)}
              >
                Rejoin
              </Button>
            </CardContent>
          </Card>
        ))
      )}

      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default withAuth(History);
