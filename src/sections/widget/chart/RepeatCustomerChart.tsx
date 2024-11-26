import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, Area } from 'recharts';
import { useTheme } from '@mui/material/styles';

// Define TypeScript interfaces
interface MonthlyDonation {
  year: number;
  month: number;
  totalEarnings: number;
}

interface RepeatCustomerChartProps {
  monthlyDonations: MonthlyDonation[];
}

const RepeatCustomerChart: React.FC<RepeatCustomerChartProps> = ({ monthlyDonations }) => {
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
      totalEarnings: donation.totalEarnings
    }));

  // Helper function to convert month number to month name
  function getMonthName(monthNumber: number): string {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString('default', { month: 'short' });
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData} margin={{ top: 50, right: 30, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="colorTotalEarnings" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8} />
            <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
        <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
        <YAxis stroke={theme.palette.text.secondary} />
        <Tooltip
          formatter={(value: number) => [`R${value.toLocaleString()}`, 'Total Earnings']}
          labelFormatter={(label: string) => `Month: ${label}`}
        />
        <Legend verticalAlign="top" height={36} />

        {/* Area Under the Line */}
        <Area type="monotone" dataKey="totalEarnings" stroke={theme.palette.primary.main} fillOpacity={1} fill="url(#colorTotalEarnings)" />

        {/* Smooth Line */}
        <Line
          type="monotone"
          dataKey="totalEarnings"
          stroke={theme.palette.primary.main}
          strokeWidth={2}
          dot={{ r: 5, stroke: theme.palette.background.paper, strokeWidth: 2 }}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RepeatCustomerChart;
