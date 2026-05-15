import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, TextField, MenuItem, Chip, Divider, Tooltip } from "@mui/material";
import axios from "axios";

const api = axios.create({ baseURL: process.env.NODE_ENV === "production" ? "/api" : "http://localhost:4000/api" });

const inputSx = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "#080810",
    borderRadius: 0,
    "& fieldset": { borderColor: "#a78bfa2a", borderRadius: 0 },
    "&:hover fieldset": { borderColor: "#a78bfa88" },
    "&.Mui-focused fieldset": { borderColor: "#fbbf24", boxShadow: "0 0 0 1px #fbbf2422" },
  },
  "& .MuiInputLabel-root": { color: "#c4b5fd", fontFamily: "monospace", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#fbbf24" },
  "& .MuiSelect-select": { color: "#e2e8f0", fontFamily: "monospace", fontSize: 13 },
};

export default function Documents() {
  const [docs, setDocs] = useState({});
  const [pais, setPais] = useState("");
  const [copiedDoc, setCopiedDoc] = useState("");

  const handleCopyDoc = (label) => {
    const numero = label.includes(": ") ? label.split(": ")[1] : label;
    navigator.clipboard.writeText(numero);
    setCopiedDoc(label);
    setTimeout(() => setCopiedDoc(""), 1500);
  };
  useEffect(() => {
    api.get("/documentos").then(r => {
      setDocs(r.data);
      setPais(Object.keys(r.data)[0] || "");
    }).catch(() => {});
  }, []);
  return (
    <Box sx={{ pb: 4 }}>
      <Typography sx={{ fontFamily: "monospace", color: "#a78bfaaa", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", mb: 1 }}>
        INTERNAL · <span style={{ color: "#fbbf24", opacity: 0.6 }}>PAYMENT TOOLS</span>
      </Typography>
      <Typography sx={{ fontFamily: "monospace", fontWeight: 900, color: "#e2e8f0", fontSize: 22, letterSpacing: -0.5, mb: 0.5 }}>Documents</Typography>
      <Typography sx={{ fontFamily: "monospace", color: "#a78bfacc", fontSize: 12, letterSpacing: 2, mb: 3 }}>// available document types by country</Typography>

      <Paper sx={{ p: 3, mb: 2, bgcolor: "#0a0a12", border: "1px solid #a78bfa1e", borderRadius: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2.5 }}>
          <Typography sx={{ color: "#fbbf24", fontFamily: "monospace", fontSize: 11, fontWeight: 900, letterSpacing: 1 }}>[01]</Typography>
          <Typography sx={{ color: "#a78bfa", fontFamily: "monospace", fontSize: 10, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase" }}>Country</Typography>
          <Box sx={{ flex: 1, height: "1px", background: "linear-gradient(90deg, #a78bfa33, transparent)" }} />
        </Box>
        <TextField select label="Country" value={pais} onChange={e => setPais(e.target.value)} fullWidth sx={inputSx}>
          {Object.keys(docs).map(k => (
            <MenuItem key={k} value={k}>{k.charAt(0).toUpperCase() + k.slice(1)}</MenuItem>
          ))}
        </TextField>
      </Paper>

      <Paper sx={{ p: 3, bgcolor: "#0a0a12", border: "1px solid #a78bfa1e", borderRadius: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2.5 }}>
          <Typography sx={{ color: "#fbbf24", fontFamily: "monospace", fontSize: 11, fontWeight: 900, letterSpacing: 1 }}>[02]</Typography>
          <Typography sx={{ color: "#a78bfa", fontFamily: "monospace", fontSize: 10, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase" }}>Documentos</Typography>
          <Box sx={{ flex: 1, height: "1px", background: "linear-gradient(90deg, #a78bfa33, transparent)" }} />
        </Box>
        {(docs[pais] || []).length ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {docs[pais].map((d, i) => (
              <Chip
                key={i}
                label={d}
                onClick={() => handleCopyDoc(d)}
                sx={{
                  bgcolor: copiedDoc === d ? "#040a06" : "transparent",
                  color: copiedDoc === d ? "#22c55e" : "#a78bfa",
                  fontWeight: 700, fontFamily: "monospace",
                  border: `1px solid ${copiedDoc === d ? "#22c55e44" : "#a78bfa44"}`,
                  fontSize: 12, borderRadius: "2px", cursor: "pointer", letterSpacing: 1,
                  transition: "all 0.2s",
                  "&:hover": { borderColor: copiedDoc === d ? "#22c55e" : "#a78bfa", boxShadow: `0 0 8px ${copiedDoc === d ? "#22c55e1a" : "#a78bfa1a"}` }
                }}
              />
            ))}
          </Box>
        ) : (
          <Typography sx={{ color: "#a78bfa44", fontFamily: "monospace", fontSize: 11, letterSpacing: 2 }}>// no documents configured</Typography>
        )}
      </Paper>
    </Box>
  );
}
