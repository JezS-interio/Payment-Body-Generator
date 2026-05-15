import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Accordion, AccordionSummary, AccordionDetails, Grid, Chip, Divider } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";

const api = axios.create({ baseURL: process.env.NODE_ENV === "production" ? "/api" : "http://localhost:4000/api" });

export default function Countries() {
  const [paises, setPaises] = useState({});
  useEffect(() => { api.get("/paises").then(r => setPaises(r.data)).catch(() => {}); }, []);
  return (
    <Box sx={{ pb: 4 }}>
      <Typography sx={{ fontFamily: "'Space Grotesk', sans-serif", color: "#a78bfaaa", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", mb: 1 }}>
        INTERNAL · <span style={{ color: "#fbbf24", opacity: 0.6 }}>PAYMENT TOOLS</span>
      </Typography>
      <Typography sx={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900, color: "#e2e8f0", fontSize: 22, letterSpacing: -0.5, mb: 0.5 }}>Countries</Typography>
      <Typography sx={{ fontFamily: "'Space Grotesk', sans-serif", color: "#a78bfacc", fontSize: 12, letterSpacing: 2, mb: 3 }}>// currently configured countries</Typography>
      {Object.keys(paises).length === 0 ? (
          <Typography sx={{ color: "#a78bfa44", fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, letterSpacing: 2 }}>// no countries loaded</Typography>
      ) : (
        Object.entries(paises).map(([nombre, data]) => (
          <Accordion key={nombre} sx={{ mb: 1, bgcolor: "#0a0a12", border: "1px solid #a78bfa1e", borderRadius: "0 !important", "&:before": { display: "none" } }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#a78bfa" }} />}
              sx={{ "&.Mui-expanded": { borderBottom: "1px solid #a78bfa18" } }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Chip label={data.billing_address.country} sx={{ bgcolor: "transparent", color: "#fbbf24", fontWeight: 900, fontSize: 10, fontFamily: "'Space Grotesk', sans-serif", border: "1px solid #fbbf2444", borderRadius: "2px", letterSpacing: 1 }} size="small" />
                <Typography sx={{ fontWeight: 800, color: "#fff", fontSize: 15 }}>
                  {nombre.charAt(0).toUpperCase() + nombre.slice(1)}
                </Typography>
                <Chip label={data.currency} size="small" sx={{ bgcolor: "transparent", color: "#a78bfa", border: "1px solid #a78bfa33", fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, borderRadius: "2px" }} />
                <Typography sx={{ color: "#a78bfa", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 13 }}>{data.amount}</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ bgcolor: "#080810", borderTop: "1px solid #a78bfa12" }}>
              <Grid container spacing={1.5}>
                {Object.entries(data.billing_address).map(([k, v]) => (
                  <Grid item xs={6} sm={4} key={k}>
                    <Box sx={{ bgcolor: "#0a0a12", border: "1px solid #a78bfa1e", borderRadius: 0, p: 1.5 }}>
                      <Typography sx={{ color: "#a78bfaaa", fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 }}>{k}</Typography>
                      <Typography sx={{ color: "#e2e8f0", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 13, mt: 0.3 }}>{v}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Box>
  );
}

