import React from 'react';
import { Card, Typography } from '@mui/material';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useTheme } from '@mui/material/styles';

// Define TypeScript interfaces
interface MonthlyDonation {
  year: number;
  month: number;
  totalEarnings: number;
}

interface TotalIncomeProps {
  monthlyDonations: MonthlyDonation[];
}

const TotalIncome: React.FC<TotalIncomeProps> = ({ monthlyDonations }) => {
  const theme = useTheme();

  // Prepare data for the chart
  const chartData = monthlyDonations
    .sort((a, b) => {
      if (a.year === b.year) {
        return a.month - b.month;
      }
      return a.year - b.year;
    })
    .map((donation) => ({
      name: `${getMonthName(donation.month)}/${donation.year}`,
      Income: donation.totalEarnings
    }));

  // Helper function to convert month number to month name
  function getMonthName(monthNumber: number): string {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString('default', { month: 'short' });
  }

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Total Income
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value: number) => [`R${value.toLocaleString()}`, 'Income']} />
          <Bar dataKey="Income" fill={theme.palette.primary.main} />
        </BarChart>
      </ResponsiveContainer>
      <Typography variant="h5" align="right" mt={2}>
        {`R${getTotalEarnings(monthlyDonations).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`}
      </Typography>
    </Card>
  );
};

// Helper function to calculate total earnings
function getTotalEarnings(monthlyDonations: MonthlyDonation[]): number {
  return monthlyDonations.reduce((acc, donation) => acc + donation.totalEarnings, 0);
}

export default TotalIncome;
