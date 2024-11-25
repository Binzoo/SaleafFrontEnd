// StudentMarkUploadList.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'utils/axios';

// Material-UI Components
import {
  Grid,
  Stack,
  Button,
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
  InputLabel
} from '@mui/material';

// Icons
import { Visibility } from '@mui/icons-material';

// Auth Hook
import useAuth from 'hooks/useAuth';

const StudentMarkUploadList = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [uploads, setUploads] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUploads = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`/api/StudentMarksUpload/uploads/paginated?page=${pageNumber}&pageSize=${pageSize}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          const data = response.data;
          setUploads(data.uploads);
          setTotalRecords(data.totalRecords);
          setTotalPages(data.totalPages);
        } else {
          throw new Error(`Unexpected response status: ${response.status}`);
        }
      } catch (err) {
        console.error('Error fetching student mark uploads:', err);
        setError(err.response?.data?.message || 'Failed to fetch student mark uploads.');
      } finally {
        setLoading(false);
      }
    };

    fetchUploads();
  }, [pageNumber, pageSize, token]);

  const handlePageChange = (event, value) => {
    setPageNumber(value);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPageNumber(1);
  };

  const handleViewFile = (fileUrl) => {
    window.open(fileUrl, '_blank');
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
        {/* Header and Add Button */}
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h4">Student Mark Uploads</Typography>
          </Stack>
        </Grid>

        {/* Uploads Table */}
        <Grid item xs={12}>
          {error ? (
            <Typography color="error" variant="h6">
              {error}
            </Typography>
          ) : uploads.length > 0 ? (
            <TableContainer component={Paper}>
              <Table aria-label="student mark uploads table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Upload Date</TableCell>
                    <TableCell>File</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {uploads.map((upload) => (
                    <TableRow key={upload.id}>
                      <TableCell>{upload.id}</TableCell>
                      <TableCell>{upload.name}</TableCell>
                      <TableCell>{upload.type}</TableCell>
                      <TableCell>{new Date(upload.uploadDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button variant="outlined" size="small" onClick={() => handleViewFile(upload.fileUrl)}>
                          View File
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="h6">No student mark uploads found.</Typography>
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

export default StudentMarkUploadList;
