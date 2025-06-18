import { Box, Typography, Grid, Card, CardContent, Container } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const DashboardPage = () => {
  const { userRole, userEmail } = useAuth();
  const navigate = useNavigate();

  const renderCard = (title: string, description: string, path: string) => (
    <Grid item xs={12} md={6} lg={4} key={title}>
      <Card
        sx={{
          background: 'var(--color-soft)',
          borderRadius: 2,
          cursor: 'pointer',
          '&:hover': {
            boxShadow: 6,
            background: 'var(--color-secondary-light)',
          },
        }}
        onClick={() => navigate(path)}
      >
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'var(--font-title)',
              color: 'var(--color-primary)',
              fontWeight: 700,
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              fontFamily: 'var(--font-body)',
              mt: 1,
              color: 'var(--color-text-main)',
            }}
          >
            {description}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );

  const getDashboardContent = () => {
    switch (userRole) {
      case 'super_admin':
        return (
          <Grid container spacing={3}>
            {renderCard('User Management', 'Add, edit, or remove user accounts.', '/users')}
            {renderCard('Generate Reports', 'Access and generate organization-wide reports.', '/reports/generate')}
          </Grid>
        );
      case 'admin':
        return (
          <Grid container spacing={3}>
            {renderCard('Invoices', 'View and manage all invoices.', '/invoices')}
            {renderCard('Reports', 'View reports submitted by volunteers.', '/reports')}
            {renderCard('Fund Management', 'Track and manage NGO accounts and funding.', '/accounts')}
          </Grid>
        );
      case 'volunteer':
        return (
          <Grid container spacing={3}>
            {renderCard('My Invoices', 'View your submitted invoices.', '/my-invoices')}
            {renderCard('My Reports', 'Submit and view your reports.', '/my-reports')}
          </Grid>
        );
      default:
        return (
          <Typography
            variant="body1"
            sx={{ fontFamily: 'var(--font-body)', color: 'var(--color-accent)' }}
          >
            Please contact the administrator to set up your account.
          </Typography>
        );
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontFamily: 'var(--font-title)',
            color: 'var(--color-primary)',
            fontWeight: 700,
          }}
        >
          Welcome to NGO Financial Management System
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontFamily: 'var(--font-body)',
            color: 'var(--color-accent)',
            mb: 2,
          }}
        >
          Logged in as: {userRole?.replace('_', ' ')} | {userEmail}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontFamily: 'var(--font-body)',
            color: 'var(--color-text-main)',
          }}
        >
          Manage your NGO's finances efficiently and effectively.
        </Typography>
      </Box>

      {getDashboardContent()}
    </Container>
  );
};
