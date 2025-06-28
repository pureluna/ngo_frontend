import { useEffect, useState } from 'react';
import { getInvoices } from '../services/api';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  TextField,
  MenuItem,
  Box,
  Typography,
  Button
} from '@mui/material';

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'approved':
      return 'success';
    case 'pending':
      return 'warning';
    case 'rejected':
    case 'unpaid':
      return 'error';
    case 'paid':
      return 'info';
    default:
      return 'default';
  }
};

interface Invoice {
  id: number;
  vendor: string;
  amount: number;
  date: string;
  status: string;
}

export const InvoiceTable = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filtered, setFiltered] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await getInvoices();
        setInvoices(res.data as Invoice[]);
        setFiltered(res.data as Invoice[]);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  useEffect(() => {
    let data = [...invoices];

    if (statusFilter) {
      data = data.filter((inv) => inv.status === statusFilter);
    }

    if (searchTerm) {
      data = data.filter((inv) =>
        inv.vendor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (minAmount) {
      data = data.filter((inv) => inv.amount >= parseFloat(minAmount));
    }

    if (maxAmount) {
      data = data.filter((inv) => inv.amount <= parseFloat(maxAmount));
    }

    if (filterDate) {
      data = data.filter((inv) => new Date(inv.date) >= new Date(filterDate));
    }

    setFiltered(data);
  }, [statusFilter, searchTerm, minAmount, maxAmount, filterDate, invoices]);

  const totalAmount = filtered.reduce((sum, inv) => sum + inv.amount, 0);

  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <>
      <Paper elevation={3} sx={{ p: 2, mb: 3, backgroundColor: '#f9f9f9', borderRadius: 2 }}>
  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'var(--color-primary)' }}>
    Filter Invoices
  </Typography>
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
      gap: 2,
      alignItems: 'center',
    }}
  >
    <TextField
      label="Search Vendor"
      variant="outlined"
      size="small"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <TextField
      label="Filter by Status"
      variant="outlined"
      size="small"
      select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
    >
      <MenuItem value="">All</MenuItem>
      <MenuItem value="Approved">Approved</MenuItem>
      <MenuItem value="Pending">Pending</MenuItem>
      <MenuItem value="Paid">Paid</MenuItem>
      <MenuItem value="Unpaid">Unpaid</MenuItem>
    </TextField>
    <TextField
      label="Min Amount"
      variant="outlined"
      size="small"
      type="number"
      value={minAmount}
      onChange={(e) => setMinAmount(e.target.value)}
    />
    <TextField
      label="Max Amount"
      variant="outlined"
      size="small"
      type="number"
      value={maxAmount}
      onChange={(e) => setMaxAmount(e.target.value)}
    />
    <TextField
      label="From Date"
      variant="outlined"
      size="small"
      type="date"
      InputLabelProps={{ shrink: true }}
      value={filterDate}
      onChange={(e) => setFilterDate(e.target.value)}
    />
    <Box>
      <Button
        variant="outlined"
        color="secondary"
        size="small"
        onClick={() => {
          setSearchTerm('');
          setStatusFilter('');
          setMinAmount('');
          setMaxAmount('');
          setFilterDate('');
        }}
        sx={{ mt: { xs: 1, sm: 0 } }}
      >
        Clear Filters
      </Button>
    </Box>
  </Box>
</Paper>

      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Total Invoices: {filtered.length} | Total Amount: ${totalAmount.toFixed(2)}
      </Typography>

      <TableContainer component={Paper} sx={{ background: 'var(--color-soft)', borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Vendor</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.id}</TableCell>
                <TableCell>{invoice.vendor}</TableCell>
                <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>
                  <Chip
                    label={invoice.status}
                    color={getStatusColor(invoice.status) as any}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
