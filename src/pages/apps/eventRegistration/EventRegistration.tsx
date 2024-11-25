// EventRegistrationList.jsx

import React, { useEffect, useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'utils/axios';

// Material-UI Components
import {
  Grid,
  Stack,
  Button,
  TextField,
  InputLabel,
  Typography,
  CircularProgress,
  Backdrop,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputAdornment
} from '@mui/material';

// Icons
import { Search } from '@mui/icons-material';

// Auth Hook
import useAuth from 'hooks/useAuth';

// Types (Assuming TypeScript)
interface EventRegistration {
  id: string; // Ensure your API provides a unique 'id' for each registration
  userName: string;
  firstName: string;
  lastName: string;
  paymentId: string;
  eventName: string;
  registrationDate: string;
  pacakageName: string;
  amount: number;
  isPaid: boolean;
}

interface ApiResponse {
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  data: EventRegistration[];
}

const EventRegistrationList = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchRegistrations = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get<ApiResponse>(`/EventRegistration?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(response.data);
        if (response.status === 200) {
          setRegistrations(response.data.data);
          setTotalItems(response.data.totalItems);
          setTotalPages(response.data.totalPages);
        } else {
          throw new Error(`Unexpected response status: ${response.status}`);
        }
      } catch (err: any) {
        console.error('Error fetching event registrations:', err);
        setError(err.message || 'Failed to fetch event registrations.');
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [pageNumber, pageSize, searchQuery, token]);

  const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
    setPageNumber(value);
  };

  const handlePageSizeChange = (event: ChangeEvent<{ value: unknown }>) => {
    setPageSize(event.target.value as number);
    setPageNumber(1); // Reset to first page when page size changes
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPageNumber(1); // Reset to first page on new search
  };

  const handleViewDetails = (id: string) => {
    navigate(`/event-registration/details/${id}`);
  };

  return (
    <>
      {/* Loading Backdrop */}
      <Backdrop
        open={loading}
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Grid container spacing={3} sx={{ padding: '20px' }}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h4">Event Registrations</Typography>
          </Stack>
        </Grid>

        {/* Search Bar */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by name, email, or event"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }}
          />
        </Grid>

        {/* Registrations Table */}
        <Grid item xs={12}>
          {error ? (
            <Typography color="error" variant="h6">
              {error}
            </Typography>
          ) : registrations.length > 0 ? (
            <TableContainer component={Paper}>
              <Table aria-label="event registrations table">
                <TableHead>
                  <TableRow>
                    <TableCell>Registrant Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Event Name</TableCell>
                    <TableCell>Registration Date</TableCell>
                    <TableCell>Package Name</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Payment Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {registrations.map((registration) => (
                    <TableRow key={registration.id}>
                      <TableCell>{`${registration.firstName} ${registration.lastName}`}</TableCell>
                      <TableCell>{registration.userName}</TableCell>
                      <TableCell>{registration.eventName}</TableCell>
                      <TableCell>{new Date(registration.registrationDate).toLocaleDateString()}</TableCell>
                      <TableCell>{registration.pacakageName}</TableCell>
                      <TableCell>{`R ${registration.amount.toFixed(2)}`}</TableCell>
                      <TableCell>
                        {registration.isPaid ? <Typography color="green">Paid</Typography> : <Typography color="red">Unpaid</Typography>}
                      </TableCell>
                      <TableCell align="right">
                        <Button variant="outlined" color="primary" onClick={() => handleViewDetails(registration.id)}>
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="h6">No event registrations found.</Typography>
          )}
        </Grid>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <FormControl variant="outlined" size="small">
                <InputLabel id="page-size-label">Items per page</InputLabel>
                <Select
                  labelId="page-size-label"
                  id="page-size-select"
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  label="Items per page"
                >
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                </Select>
              </FormControl>

              <Pagination count={totalPages} page={pageNumber} onChange={handlePageChange} color="primary" />
            </Stack>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default EventRegistrationList;
