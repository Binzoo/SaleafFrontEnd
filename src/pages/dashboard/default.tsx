import React, { useEffect, useState } from 'react';
import axios from 'utils/axios';
import { useTheme, Grid, Stack, Typography, CircularProgress, Box, Alert, Snackbar, Card } from '@mui/material';

// Import your custom components
import EcommerceDataCard from 'components/cards/statistics/EcommerceDataCard';
import EcommerceDataChart from 'sections/widget/chart/EcommerceDataChart';
import RepeatCustomerRate from 'sections/widget/chart/RepeatCustomerRate';
import Transactions from 'sections/widget/data/Transactions';
import TotalIncome from 'sections/widget/chart/TotalIncome';

// Import icons
import { ArrowDown, ArrowUp, Book, Calendar, CloudChange, Wallet3 } from 'iconsax-react';

// Define TypeScript interfaces based on the API response
interface MonthlyDonation {
  year: number;
  month: number;
  totalEarnings: number;
}

interface DonationTransaction {
  id: number;
  amount: number;
  currency: string;
  paymentId: string;
  isPaid: boolean;
  createdAt: string;
  isAnonymous: boolean;
  appUserId: string;
  appUser: any; // Adjust this type based on actual structure
}

interface DashboardData {
  allDonationsAmount: number;
  totalEarningsMonth: number;
  numberOfEvents: number;
  numberOfStudents: number;
  monthlyDonations: MonthlyDonation[];
  donationsTransactions: DonationTransaction[];
}

const DashboardDefault: React.FC = () => {
  const theme = useTheme();

  // State variables
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Snackbar state for notifications
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Function to fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await axios.get<DashboardData>('/api/DashBoard');
      setDashboardData(response.data);
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to fetch dashboard data.');
      setSnackbar({
        open: true,
        message: 'Failed to fetch dashboard data.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Helper function to format amounts
  const formatAmount = (amount: number) => {
    if (Math.abs(amount) >= 1000000) {
      return `R${amount.toExponential(2)}`;
    }
    return `R${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Check if loading */}
      {loading ? (
        <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Grid>
      ) : error ? (
        <Grid item xs={12}>
          <Alert severity="error">{error}</Alert>
        </Grid>
      ) : dashboardData ? (
        <>
          {/* Row 1: Data Cards */}
          <Grid item xs={12} sm={6} lg={3}>
            <EcommerceDataCard
              title="All Donations"
              count={formatAmount(dashboardData.allDonationsAmount)}
              iconPrimary={<Wallet3 size={24} />}
            ></EcommerceDataCard>
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <EcommerceDataCard
              title="Total Earnings This Month"
              count={formatAmount(dashboardData.totalEarningsMonth)}
              color="warning"
              iconPrimary={<Book size={24} color={theme.palette.warning.dark} />}
            ></EcommerceDataCard>
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <EcommerceDataCard
              title="Number of Events"
              count={dashboardData.numberOfEvents.toString()}
              color="success"
              iconPrimary={<Calendar size={24} color={theme.palette.success.darker} />}
            ></EcommerceDataCard>
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <EcommerceDataCard
              title="Number of Students"
              count={dashboardData.numberOfStudents.toString()}
              color="error"
              iconPrimary={<CloudChange size={24} color={theme.palette.error.dark} />}
            ></EcommerceDataCard>
          </Grid>

          {/* Row 2: Repeat Customer Rate */}
          <Grid item xs={12} md={8} lg={12}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <RepeatCustomerRate monthlyDonations={dashboardData.monthlyDonations} />
              </Grid>
            </Grid>
          </Grid>

          {/* Row 3: Transactions and Total Income */}
          <Grid item xs={12} md={6}>
            <Transactions donationsTransactions={dashboardData.donationsTransactions} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TotalIncome monthlyDonations={dashboardData.monthlyDonations} />
          </Grid>
        </>
      ) : (
        <Grid item xs={12}>
          <Alert severity="info">No data available.</Alert>
        </Grid>
      )}
    </Grid>
  );
};

export default DashboardDefault;
