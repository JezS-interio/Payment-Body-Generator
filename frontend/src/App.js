import React, { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Box, Tabs, Tab, Typography, Container } from "@mui/material";
import PaymentBody from "./components/PaymentBody";
import Countries from "./components/Countries";
import AddCountry from "./components/AddCountry";
import Methods from "./components/Methods";
import Documents from "./components/Documents";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#a78bfa" },
    secondary: { main: "#fbbf24" },
    background: { default: "#06060e", paper: "#0a0a12" },
    text: { primary: "#e2e8f0", secondary: "#a78bfa" }
  },
  typography: { fontFamily: "'Space Grotesk', 'Inter', sans-serif" },
  shape: { borderRadius: 0 },
  components: {
    MuiPaper: { styleOverrides: { root: { borderRadius: 0 } } },
    MuiButton: { styleOverrides: { root: { borderRadius: 0 } } },
    MuiChip: { styleOverrides: { root: { borderRadius: "2px" } } },
    MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 0 } } },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: "#e2e8f0",
          "&:hover": { backgroundColor: "#a78bfa15" },
          "&.Mui-selected": { backgroundColor: "#a78bfa22" }
        }
      }
    }
  }
});

export default function App() {
  const [tab, setTab] = useState(0);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        minHeight: "100vh", bgcolor: "#06060e",
        backgroundImage: "linear-gradient(#a78bfa07 1px, transparent 1px), linear-gradient(90deg, #a78bfa07 1px, transparent 1px)",
        backgroundSize: "48px 48px"
      }}>
        {/* TOP BAR */}
        <Box sx={{
          borderBottom: "1px solid #a78bfa1a", px: { xs: 2, md: 6 }, py: 1.5,
          display: "flex", alignItems: "center", gap: 3, bgcolor: "#06060e"
        }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img src="/s-interio-logo.webp" alt="S-Interio" style={{ height: 36, objectFit: "contain" }} />
          </Box>
          <Box sx={{ width: "1px", height: 14, bgcolor: "#a78bfa33" }} />
          <Typography sx={{ fontFamily: "'Space Grotesk', sans-serif", color: "#fbbf24", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", opacity: 0.7, fontWeight: 600 }}>
            Payments Console
          </Typography>
          <Box sx={{ flex: 1 }} />
          <Box sx={{ border: "1px solid #a78bfa22", px: 1.5, py: 0.5, display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
            <Typography sx={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 9, color: "#a78bfa77", letterSpacing: 1 }}>LIVE</Typography>
          </Box>
        </Box>

        {/* NAV */}
        <Box sx={{ borderBottom: "1px solid #a78bfa12", px: { xs: 2, md: 6 }, bgcolor: "#08080f" }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            TabIndicatorProps={{ style: { backgroundColor: "#fbbf24", height: "1px" } }}
            sx={{
              "& .MuiTab-root": {
                fontFamily: "'Space Grotesk', sans-serif", color: "#a78bfaaa", fontWeight: 600, fontSize: 12,
                letterSpacing: 1, minHeight: 46, textTransform: "uppercase", px: 3, transition: "color 0.2s"
              },
              "& .Mui-selected": { color: "#f8fafc !important" },
              "& .MuiTab-root:hover": { color: "#a78bfa !important" },
            }}
          >
            <Tab label="[ 01 ]  Body" />
            <Tab label="[ 02 ]  Docs" />
            <Tab label="[ 03 ]  Add Country" />
            <Tab label="[ 04 ]  Countries" />
            <Tab label="[ 05 ]  Methods" />
          </Tabs>
        </Box>

        {/* CONTENT — keep all mounted to preserve form state across tab switches */}
        <Container maxWidth="lg" sx={{ pt: 4, pb: 8, px: { xs: 2, md: 6 } }}>
          <Box sx={{ display: tab === 0 ? "block" : "none" }}><PaymentBody /></Box>
          <Box sx={{ display: tab === 1 ? "block" : "none" }}><Documents /></Box>
          <Box sx={{ display: tab === 2 ? "block" : "none" }}><AddCountry /></Box>
          <Box sx={{ display: tab === 3 ? "block" : "none" }}><Countries /></Box>
          <Box sx={{ display: tab === 4 ? "block" : "none" }}><Methods /></Box>
        </Container>

        <Typography align="center" sx={{ color: "#a78bfa22", pb: 4, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: 2, fontSize: 10, textTransform: "uppercase" }}>
          by Jezabel Rosso
        </Typography>
      </Box>
    </ThemeProvider>
  );
}

