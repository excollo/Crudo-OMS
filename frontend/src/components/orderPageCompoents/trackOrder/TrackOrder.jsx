import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  InputAdornment,
  CircularProgress,
  Pagination,
  Select,
  FormControl,
  InputLabel,
  Stack,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Alert,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// Custom styled components
const ContentContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  height: "100%",
  backgroundColor: theme.palette.grey[50],
  display: "flex",
  flexDirection: "column",
}));

const SearchFilterContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const TablePaper = styled(Paper)(({ theme }) => ({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
}));

const PaginationContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  justifyContent: "center",
  borderTop: `1px solid ${theme.palette.divider}`,
}));

// Status styling configurations
const statusConfig = {
  Created: { color: "info", label: "Created" },
  Dispatched: { color: "secondary", label: "Dispatched" },
  Pending: { color: "warning", label: "Pending" },
  Delivered: { color: "success", label: "Delivered" },
};

const TrackOrder = () => {
  // State management
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const ordersPerPage = 10;

  // Menu state for status change and actions
  const [statusMenuAnchor, setStatusMenuAnchor] = useState(null);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  // Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:3000/api/order/orders"
        );

        // If API returns no data, use sample data for development
        const responseData =
          response.data && response.data.length > 0
            ? response.data
            : generateSampleOrders();

        setOrders(responseData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching orders:", err);
        // Use sample data if API fails
        setOrders(generateSampleOrders());
        setError("Failed to fetch orders from API. Showing sample data.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Generate sample orders for development
  const generateSampleOrders = () => {
    const statuses = ["Created", "Dispatched", "Pending", "Delivered"];
    return Array.from({ length: 23 }, (_, i) => ({
      _id: `order_${i + 1}`,
      orderID: `1234${i + 1}`,
      customerName: "Yatharth Raj",
      phoneNo: "99337799",
      orderDate: "24-8-2024",
      amount: 400,
      status: statuses[Math.floor(Math.random() * statuses.length)],
    }));
  };

  // Update filtered orders and pagination whenever relevant state changes
  useEffect(() => {
    const filtered = filterOrders();
    setTotalPages(Math.ceil(filtered.length / ordersPerPage));
    // Reset to first page when filters change
    if (currentPage > Math.ceil(filtered.length / ordersPerPage)) {
      setCurrentPage(1);
    }
  }, [orders, searchTerm, statusFilter, dateFilter]);

  // Filter orders based on search term and filters
  const filterOrders = () => {
    return orders.filter((order) => {
      // Filter by search term
      const matchesSearch =
        order.orderID?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phoneNo?.toString().includes(searchTerm);

      // Filter by status
      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;

      // Filter by date (placeholder for actual implementation)
      const matchesDate = dateFilter === "All"; // simplified for now

      return matchesSearch && matchesStatus && matchesDate;
    });
  };

  // Get current orders for the page
  const getCurrentOrders = () => {
    const filtered = filterOrders();
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    return filtered.slice(indexOfFirstOrder, indexOfLastOrder);
  };

  // Handle order selection
  const handleOrderSelection = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  // Handle select all orders
  const handleSelectAllOrders = (event) => {
    if (event.target.checked) {
      const filteredOrderIds = filterOrders().map((order) => order._id);
      setSelectedOrders(filteredOrderIds);
    } else {
      setSelectedOrders([]);
    }
  };

  // Handle status menu
  const handleStatusMenuOpen = (event, orderId) => {
    setStatusMenuAnchor(event.currentTarget);
    setSelectedOrderId(orderId);
  };

  const handleStatusMenuClose = () => {
    setStatusMenuAnchor(null);
    setSelectedOrderId(null);
  };

  // Handle action menu
  const handleActionMenuOpen = (event, orderId) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedOrderId(orderId);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedOrderId(null);
  };

  // Update order status
  const updateOrderStatus = async (newStatus) => {
    try {
      // API call to update status
      await axios.put(`http://localhost:3000/api/order/${selectedOrderId}`, {
        status: newStatus,
      });

      // Update local state
      setOrders(
        orders.map((order) =>
          order._id === selectedOrderId
            ? { ...order, status: newStatus }
            : order
        )
      );
    } catch (err) {
      console.error("Error updating order status:", err);
      // Update local state anyway for demo purposes
      setOrders(
        orders.map((order) =>
          order._id === selectedOrderId
            ? { ...order, status: newStatus }
            : order
        )
      );
    }

    handleStatusMenuClose();
  };

  // Delete order
  const handleDeleteOrder = (orderId) => {
    setOrderToDelete(orderId);
    setDeleteDialogOpen(true);
    handleActionMenuClose();
  };

  const confirmDeleteOrder = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/order/${orderToDelete}`);
      setOrders(orders.filter((order) => order._id !== orderToDelete));
    } catch (err) {
      console.error("Error deleting order:", err);
      // Remove from local state anyway for demo purposes
      setOrders(orders.filter((order) => order._id !== orderToDelete));
    }

    setDeleteDialogOpen(false);
    setOrderToDelete(null);
  };

  // Handle pagination change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Check if all orders on current page are selected
  const isAllSelected = () => {
    const currentOrderIds = getCurrentOrders().map((order) => order._id);
    return (
      currentOrderIds.length > 0 &&
      currentOrderIds.every((id) => selectedOrders.includes(id))
    );
  };

  return (
    <ContentContainer>
      {/* Search and Filter Section */}
      <SearchFilterContainer elevation={1}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack
              direction="row"
              spacing={2}
              justifyContent={{ xs: "flex-start", md: "flex-end" }}
            >
              <Button
                variant="contained"
                startIcon={<FilterListIcon />}
                sx={{
                  bgcolor: "#f87171",
                  "&:hover": { bgcolor: "#ef4444" },
                }}
              >
                Filters
              </Button>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="date-filter-label">Date</InputLabel>
                <Select
                  labelId="date-filter-label"
                  id="date-filter"
                  value={dateFilter}
                  label="Date"
                  onChange={(e) => setDateFilter(e.target.value)}
                  endAdornment={<KeyboardArrowDownIcon />}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Today">Today</MenuItem>
                  <MenuItem value="This Week">This Week</MenuItem>
                  <MenuItem value="This Month">This Month</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Grid>
        </Grid>
      </SearchFilterContainer>

      {/* Orders Table */}
      <TablePaper elevation={1}>
        <TableContainer sx={{ flexGrow: 1 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selectedOrders.length > 0 && !isAllSelected()
                    }
                    checked={isAllSelected()}
                    onChange={handleSelectAllOrders}
                  />
                </TableCell>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer Name</TableCell>
                <TableCell>Phone No.</TableCell>
                <TableCell>Order Date</TableCell>
                <TableCell>Order Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <CircularProgress size={24} sx={{ my: 2 }} />
                    <Typography>Loading orders...</Typography>
                  </TableCell>
                </TableRow>
              ) : getCurrentOrders().length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography color="textSecondary">
                      No orders found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                getCurrentOrders().map((order) => (
                  <TableRow
                    key={order._id}
                    hover
                    selected={selectedOrders.includes(order._id)}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedOrders.includes(order._id)}
                        onChange={() => handleOrderSelection(order._id)}
                      />
                    </TableCell>
                    <TableCell>#{order.orderID}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.phoneNo}</TableCell>
                    <TableCell>{order.orderDate}</TableCell>
                    <TableCell>${order.amount}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={(e) => handleStatusMenuOpen(e, order._id)}
                        endIcon={<KeyboardArrowDownIcon />}
                        sx={{
                          borderRadius: 4,
                          textTransform: "none",
                          px: 1.5,
                        }}
                        color={statusConfig[order.status]?.color || "default"}
                      >
                        {order.status}
                      </Button>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={(e) => handleActionMenuOpen(e, order._id)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Error message if any */}
        {error && (
          <Box px={2} py={1}>
            <Alert severity="warning">{error}</Alert>
          </Box>
        )}

        {/* Pagination */}
        {totalPages > 0 && (
          <PaginationContainer>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </PaginationContainer>
        )}
      </TablePaper>

      {/* Status Menu */}
      <Menu
        anchorEl={statusMenuAnchor}
        open={Boolean(statusMenuAnchor)}
        onClose={handleStatusMenuClose}
      >
        {Object.keys(statusConfig).map((status) => (
          <MenuItem key={status} onClick={() => updateOrderStatus(status)}>
            <Chip
              label={status}
              size="small"
              color={statusConfig[status].color}
              variant="outlined"
              sx={{ mr: 1 }}
            />
            {status}
          </MenuItem>
        ))}
      </Menu>

      {/* Action Menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionMenuClose}
      >
        <MenuItem onClick={() => handleDeleteOrder(selectedOrderId)}>
          <DeleteIcon fontSize="small" sx={{ mr: 1, color: "error.main" }} />
          <Typography color="error">Remove Order</Typography>
        </MenuItem>
        <MenuItem onClick={handleActionMenuClose}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit Info
        </MenuItem>
        <MenuItem onClick={handleActionMenuClose}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
          View Prescription
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this order? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={confirmDeleteOrder}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </ContentContainer>
  );
};

export default TrackOrder;
