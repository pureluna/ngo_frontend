import { useContext } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { AuthContext } from '../contexts/AuthContext';
import { Paper, Typography } from '@mui/material';

export const UserProfilePage = () => {
  const { user } = useContext(AuthContext) as any;

  return (
    <DashboardLayout title="User Profile">
      <Paper sx={{ maxWidth: 480, p: 4, mx: 'auto', background: 'var(--color-soft)', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>User Information</Typography>
        {user ? (
          <>
            <Typography><strong>ID:</strong> {user.id}</Typography>
            <Typography><strong>Username:</strong> {user.username}</Typography>
            <Typography><strong>Role:</strong> {user.role}</Typography>
          </>
        ) : (
          <Typography>No user data found.</Typography>
        )}
      </Paper>
    </DashboardLayout>
  );
};
