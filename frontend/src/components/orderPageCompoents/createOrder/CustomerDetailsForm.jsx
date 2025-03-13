import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Paper,
  Grid,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { debounce } from "lodash";
import CustomerService from "../../../services/customerServices/CustomerService"; // Adjust path as needed

const CustomerDetailsForm = ({ formData, handleChange, setFormData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const searchInputRef = useRef(null);

  // Create a debounced search function
  const debouncedSearch = useCallback(
    debounce(async (search) => {
      setLoading(true);
      try {
        // Reset page when new search is performed
        const pageNo = 1;
        const pageSize = 10;
        const result = await CustomerService.getCustomers(
          pageNo,
          pageSize,
          search
        );
        // console.log("API result:", result);

        // Store the raw data from API for use when selecting a customer
        setCustomers(result.data || []);
        setPage(1);
        setHasMore(result.data?.length === pageSize);
      } catch (error) {
        console.error("Error searching customers:", error);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  // Initialize with empty search on component mount
  useEffect(() => {
    const fetchInitialCustomers = async () => {
      setLoading(true);
      try {
        const result = await CustomerService.getCustomers(1, 10, "");
        setCustomers(result.data || []);
        setHasMore(result.data?.length === 10);
      } catch (error) {
        console.error("Error fetching initial customers:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isInputFocused) {
      fetchInitialCustomers();
    }
  }, [isInputFocused]);

  // Handle search term changes
  useEffect(() => {
    if (searchTerm !== null) {
      debouncedSearch(searchTerm);
    }
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  // Infinite scroll using intersection observer
  const lastCustomerRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          const nextPage = page + 1;
          setPage(nextPage);

          // Fetch more customers when scrolling
          const fetchMoreCustomers = async () => {
            setLoading(true);
            try {
              const result = await CustomerService.getCustomers(
                nextPage,
                10,
                searchTerm
              );

              if (result.data && result.data.length > 0) {
                setCustomers((prev) => [...prev, ...result.data]);
                setHasMore(result.data.length === 10);
              } else {
                setHasMore(false);
              }
            } catch (error) {
              console.error("Error fetching more customers:", error);
            } finally {
              setLoading(false);
            }
          };

          fetchMoreCustomers();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, page, searchTerm]
  );

  // Handle search input focus
  const handleSearchFocus = () => {
    setIsInputFocused(true);
  };

  // Handle click outside search input
  const handleClickOutside = useCallback((event) => {
    if (
      searchInputRef.current &&
      !searchInputRef.current.contains(event.target)
    ) {
      setIsInputFocused(false);
    }
  }, []);

  // Setup and cleanup event listeners
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Also update the formData for the search field
    setFormData({
      ...formData,
      Party: e.target.value,
    });
  };

  const handleSelectCustomer = (customer) => {
    // console.log("Selected customer:", customer);

    // Map the API response fields to the form fields
    const updatedFormData = {
      ...formData,
      Party: customer.Party || "",
      Email: customer.Email || "",
      Phone: customer.Phone || customer.Mobile || "",
      Address: customer.Address || "",
      Pincode: customer.Pincode || "",
      Station: customer.Station || "",
      // Map age and sex from DOB and other fields if available
      age: calculateAge(customer.Dob) || "",
      sex: customer.Gender || "", // Field not in sample data, adjust as needed
      referBy: customer.ReferBy || "",
      // Additional fields from API
      PKID: customer.PKID || "",
      gstno: customer.Gstno || "",
      panNo: customer.PanNo || "",
    };

    // console.log("Updated form data:", updatedFormData);
    setFormData(updatedFormData);

    // Clear search and hide dropdown
    setSearchTerm("");
    setIsInputFocused(false);
  };

  // Helper function to calculate age from DOB
  const calculateAge = (dob) => {
    if (!dob) return "";

    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return "";

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age.toString();
  };

  // Handle form field changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <Paper
      elevation={3}
      sx={{
        // ml: "13%",
        p: 3,
        
        height: "100%",
        borderRadius: "1%",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Grid container spacing={2}>
        <Box
          mb={3}
          sx={{
            width: "100%",
            p: "2%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography
              variant="h6"
              component="h2"
              sx={{ fontWeight: "700", color: "#72787F" }}
            >
              Customer Details
            </Typography>
          </Box>
          <Box>
            <Button
              variant="contained"
              sx={{
                fontWeight: "700",
                color: "#72787F",
                bgcolor: "#E8EBED",
                outline: "none",
                border: "none",
                "&:focus": { outline: "none" },
                "&:active": { outline: "none" },
                "&:hover": { bgcolor: "#e0e0e0" },
              }}
            >
              Update Customer
            </Button>
          </Box>
        </Box>

        {/* Customer ID (PKID) - Hidden field to store the selected customer ID */}
        <input type="hidden" name="PKID" value={formData.PKID || ""} />

        {/* Full Name with Search Functionality */}
        <Grid item xs={12}>
          <InputLabel htmlFor="fullName" required sx={{ mb: 1 }}>
            Full name
          </InputLabel>
          <Box sx={{ position: "relative" }} ref={searchInputRef}>
            <TextField
              id="fullName"
              name="Party"
              fullWidth
              variant="outlined"
              value={formData.Party || ""}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              required
            />

            {/* Customer Search Results Dropdown with Infinite Scrolling */}
            {isInputFocused && (
              <Paper
                sx={{
                  position: "absolute",
                  width: "100%",
                  zIndex: 10,
                  maxHeight: "300px",
                  overflowY: "auto",
                  boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                }}
              >
                <List>
                  {customers.length > 0 ? (
                    customers.map((customer, index) => {
                      // Apply ref to the last item for infinite scrolling
                      const isLastItem = index === customers.length - 1;

                      return (
                        <ListItem
                          ref={isLastItem ? lastCustomerRef : null}
                          key={customer.PKID || index}
                          onClick={() => handleSelectCustomer(customer)}
                          sx={{
                            cursor: "pointer",
                            "&:hover": {
                              backgroundColor: "rgba(0, 0, 0, 0.04)",
                            },
                          }}
                        >
                          <ListItemText
                            primary={customer.Party}
                            secondary={`${customer.Email || "No email"} | ${
                              customer.Phone || customer.Mobile || "No phone"
                            } | ${customer.StatusDesc || ""}`}
                          />
                        </ListItem>
                      );
                    })
                  ) : !loading ? (
                    <ListItem>
                      <ListItemText
                        primary="No customers found"
                        secondary={
                          searchTerm
                            ? "Try a different search term"
                            : "Start typing to search customers"
                        }
                      />
                    </ListItem>
                  ) : null}

                  {loading && (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", p: 2 }}
                    >
                      <CircularProgress size={24} />
                    </Box>
                  )}
                </List>
              </Paper>
            )}
          </Box>
        </Grid>

        {/* Email and Phone in a row */}
        <Grid item xs={12} md={6}>
          <InputLabel htmlFor="email" required sx={{ mb: 1 }}>
            Email
          </InputLabel>
          <TextField
            id="email"
            name="Email"
            fullWidth
            variant="outlined"
            value={formData.Email || ""}
            onChange={handleFormChange}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputLabel htmlFor="phoneNumber" required sx={{ mb: 1 }}>
            Phone Number
          </InputLabel>
          <TextField
            id="phoneNumber"
            name="Phone"
            fullWidth
            variant="outlined"
            value={formData.Phone || ""}
            onChange={handleFormChange}
            required
          />
        </Grid>

        {/* Age and Sex in a row */}
        <Grid item xs={12} md={6}>
          <InputLabel htmlFor="age" required sx={{ mb: 1 }}>
            Age
          </InputLabel>
          <TextField
            id="age"
            name="age"
            fullWidth
            variant="outlined"
            value={formData.age || ""}
            onChange={handleFormChange}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputLabel htmlFor="sex" required sx={{ mb: 1 }}>
            Sex
          </InputLabel>
          <FormControl fullWidth>
            <Select
              id="sex"
              name="sex"
              value={formData.sex || ""}
              onChange={handleFormChange}
              required
              displayEmpty
            >
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Address */}
        <Grid item xs={12}>
          <InputLabel htmlFor="address" required sx={{ mb: 1 }}>
            Address
          </InputLabel>
          <TextField
            id="address"
            name="Address"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={formData.Address || ""}
            onChange={handleFormChange}
            required
          />
        </Grid>

        {/* GST Number and PAN Number */}
        <Grid item xs={12} md={6}>
          <InputLabel htmlFor="gstno" sx={{ mb: 1 }}>
            GST Number
          </InputLabel>
          <TextField
            id="gstno"
            name="gstno"
            fullWidth
            variant="outlined"
            value={formData.gstno || ""}
            onChange={handleFormChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputLabel htmlFor="panNo" sx={{ mb: 1 }}>
            PAN Number
          </InputLabel>
          <TextField
            id="panNo"
            name="panNo"
            fullWidth
            variant="outlined"
            value={formData.panNo || ""}
            onChange={handleFormChange}
          />
        </Grid>

        {/* Pincode and Station */}
        <Grid item xs={12} md={6}>
          <InputLabel htmlFor="pincode" sx={{ mb: 1 }}>
            Pincode
          </InputLabel>
          <TextField
            id="pincode"
            name="Pincode"
            fullWidth
            variant="outlined"
            value={formData.Pincode || ""}
            onChange={handleFormChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputLabel htmlFor="station" sx={{ mb: 1 }}>
            Station
          </InputLabel>
          <TextField
            id="station"
            name="Station"
            fullWidth
            variant="outlined"
            value={formData.Station || ""}
            onChange={handleFormChange}
          />
        </Grid>

        {/* Refer by */}
        <Grid item xs={12}>
          <InputLabel htmlFor="referBy" required sx={{ mb: 1 }}>
            Refer by
          </InputLabel>
          <TextField
            id="referBy"
            name="referBy"
            fullWidth
            variant="outlined"
            value={formData.referBy || ""}
            onChange={handleFormChange}
            required
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CustomerDetailsForm;
