
import { InputBase, useMediaQuery } from "@mui/material";
import { styled, alpha, useTheme } from "@mui/material/styles";
import { SearchIcon } from "lucide-react";


const SearchComponent = ({ handleSearchChange }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // Styled components
  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: "20px",
    background: "#fff",
    // backgroundColor: alpha(theme.palette.common.black, 0),
    // "&:hover": {
    //   backgroundColor: alpha(theme.palette.common.black, 0),
    // },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  }));

  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
   
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: alpha(theme.palette.common.black, 0.4),
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
  
    width: "100%",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
      width: "100%",
     
    },
  }));

  return (
    <>
      {/* Search */}
      <Search
        sx={{
          color: "#64748B",
          border: "1px solid #E0E0E0",
          display: { xs: isMobile ? "none" : "flex", sm: "flex" },
          width: { xs: "120px", sm: "40%" },
        }}
      >
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search"
          inputProps={{ "aria-label": "search" }}
          onChange={handleSearchChange}
        />
      </Search>
    </>
  );
};

export default SearchComponent;
