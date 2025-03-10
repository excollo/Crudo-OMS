import React from "react";
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
} from "@mui/material";
import { KeyboardArrowDown as KeyboardArrowDownIcon } from "@mui/icons-material";

const DosageInstructions = ({ dosageInstructions, setDosageInstructions }) => {
  // Function to update the dosage instructions array when a user selects a value
  const handleChange = (index, field, value) => {
    setDosageInstructions((prevInstructions) =>
      prevInstructions.map((instruction, i) =>
        i === index ? { ...instruction, [field]: value } : instruction
      )
    );
  };

  return (
    <Grid item xs={12} sx={{ mt: 2 }}>
      <Paper
        elevation={0}
        sx={{
          ml: "13%",
          p: 3,
          width: "80%",
          border: "1px solid #eee",
          borderRadius: "8px",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "#72787F",
            fontWeight: "400",
            mb: 3,
          }}
        >
          Dosage Instructions
        </Typography>

        <TableContainer component={Box}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ color: "#72787F", fontWeight: "500", border: "none" }}
                >
                  Medicine Name
                </TableCell>
                <TableCell
                  sx={{ color: "#72787F", fontWeight: "500", border: "none" }}
                >
                  Dosage
                </TableCell>
                <TableCell
                  sx={{ color: "#72787F", fontWeight: "500", border: "none" }}
                >
                  Frequency
                </TableCell>
                <TableCell
                  sx={{ color: "#72787F", fontWeight: "500", border: "none" }}
                >
                  Time
                </TableCell>
                <TableCell
                  sx={{ color: "#72787F", fontWeight: "500", border: "none" }}
                >
                  Duration
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dosageInstructions.map((instruction, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ border: "none", py: 2 }}>
                    {instruction.name}
                  </TableCell>
                  <TableCell sx={{ border: "none", py: 2 }}>
                    <FormControl fullWidth size="small">
                      <Select
                        value={instruction.dosage && ""}
                        onChange={(e) =>
                          handleChange(index, "dosage", e.target.value)
                        }
                        IconComponent={KeyboardArrowDownIcon}
                        sx={{
                          ".MuiOutlinedInput-notchedOutline": {
                            borderColor: "#e0e0e0",
                          },
                        }}
                      >
                        <MenuItem value="Half Spoon">Half Spoon</MenuItem>
                        <MenuItem value="1 Spoon">1 Spoon</MenuItem>
                        <MenuItem value="2 Spoon">2 Spoon</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell sx={{ border: "none", py: 2 }}>
                    <FormControl fullWidth size="small">
                      <Select
                        value={instruction.frequency && ""}
                        onChange={(e) =>
                          handleChange(index, "frequency", e.target.value)
                        }
                        IconComponent={KeyboardArrowDownIcon}
                        sx={{
                          ".MuiOutlinedInput-notchedOutline": {
                            borderColor: "#e0e0e0",
                          },
                        }}
                      >
                        <MenuItem value="2 times">2 times</MenuItem>
                        <MenuItem value="3 times">3 times</MenuItem>
                        <MenuItem value="4 times">4 times</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell sx={{ border: "none", py: 2 }}>
                    <FormControl fullWidth size="small">
                      <Select
                        value={instruction.time && ""}
                        onChange={(e) =>
                          handleChange(index, "time", e.target.value)
                        }
                        IconComponent={KeyboardArrowDownIcon}
                        sx={{
                          ".MuiOutlinedInput-notchedOutline": {
                            borderColor: "#e0e0e0",
                          },
                        }}
                      >
                        <MenuItem value="At Morning">At Morning</MenuItem>
                        <MenuItem value="At Evening">At Evening</MenuItem>
                        <MenuItem value="At Night">At Night</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell sx={{ border: "none", py: 2 }}>
                    <FormControl fullWidth size="small">
                      <Select
                        value={instruction.duration && ""}
                        onChange={(e) =>
                          handleChange(index, "duration", e.target.value)
                        }
                        IconComponent={KeyboardArrowDownIcon}
                        sx={{
                          ".MuiOutlinedInput-notchedOutline": {
                            borderColor: "#e0e0e0",
                          },
                        }}
                      >
                        <MenuItem value="1 Month">1 Month</MenuItem>
                        <MenuItem value="2 Month">2 Month</MenuItem>
                        <MenuItem value="3 Month">3 Month</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Grid>
  );
};

export default DosageInstructions;
