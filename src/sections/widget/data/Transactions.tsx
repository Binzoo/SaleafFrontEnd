import React from 'react';
import { Card, CardHeader, CardContent, Table, TableHead, TableRow, TableCell, TableBody, Typography } from '@mui/material';

interface DonationTransaction {
  id: number;
  amount: number;
  currency: string;
  paymentId: string;
  isPaid: boolean;
  createdAt: string;
  isAnonymous: boolean;
  appUserId: string;
  appUser: any; // Adjust based on actual structure
}

interface TransactionsProps {
  donationsTransactions: DonationTransaction[];
}

const Transactions: React.FC<TransactionsProps> = ({ donationsTransactions }) => {
  return (
    <Card>
      <CardHeader title="Recent Transactions" />
      <CardContent>
        {donationsTransactions.length === 0 ? (
          <Typography variant="body2" color="textSecondary">
            No transactions available.
          </Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Currency</TableCell>
                <TableCell>Payment ID</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {donationsTransactions.slice(0, 5).map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>#{tx.id}</TableCell>
                  <TableCell>{`R${tx.amount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}`}</TableCell>
                  <TableCell>{tx.currency}</TableCell>
                  <TableCell>{tx.paymentId}</TableCell>
                  <TableCell>
                    {tx.isPaid ? <Typography color="success.main">Paid</Typography> : <Typography color="error.main">Pending</Typography>}
                  </TableCell>
                  <TableCell>{new Date(tx.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default Transactions;
