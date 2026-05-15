import React, { useState } from "react";
import { Box, Typography, Paper, Grid, TextField, Button, Alert } from "@mui/material";
import axios from "axios";

function SectionLabel({ step, title }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2.5 }}>
      <Typography sx={{ color: "#fbbf24", fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 900, letterSpacing: 1, whiteSpace: "nowrap" }}>
        [{step}]
      </Typography>
      <Typography sx={{ color: "#c4b5fd", fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", whiteSpace: "nowrap" }}>
        {title}
      </Typography>
      <Box sx={{ flex: 1, height: "1px", background: "linear-gradient(90deg, #a78bfa33, transparent)" }} />
    </Box>
  );
}

const api = axios.create({ baseURL: process.env.NODE_ENV === "production" ? "/api" : "http://localhost:4000/api" });

export default function AddCountry() {
  const [form, setForm] = useState({
    nombre: "",
    amount: "",
    currency: "",
    billing_address: {
      country: "",
      state: "",
      city: "",
      address: "",
      zip: "",
      phone: ""
    }
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("billing_address.")) {
      const key = name.split(".")[1];
      setForm(f => ({ ...f, billing_address: { ...f.billing_address, [key]: value } }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.post("/paises", form);
      setSuccess("Country saved successfully.");
      setForm({
        nombre: "",
        amount: "",
        currency: "",
        billing_address: { country: "", state: "", city: "", address: "", zip: "", phone: "" }
      });
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      bgcolor: "#080810",
      borderRadius: 0,
      "& fieldset": { borderColor: "#a78bfa2a", borderRadius: 0 },
      "&:hover fieldset": { borderColor: "#a78bfa88" },
      "&.Mui-focused fieldset": { borderColor: "#fbbf24", boxShadow: "0 0 0 1px #fbbf2422" },
    },
    "& .MuiInputLabel-root": { color: "#c4b5fd", fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#fbbf24" },
    "& input": { color: "#e2e8f0", fontFamily: "'Space Grotesk', sans-serif", fontSize: 13 },
  };
  const paperSx = { p: 3, mb: 2, bgcolor: "#0a0a12", border: "1px solid #a78bfa1e", borderRadius: 0 };

  return (
    <Box sx={{ pb: 4 }}>
      <Typography sx={{ fontFamily: "'Space Grotesk', sans-serif", color: "#a78bfaaa", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", mb: 1 }}>
        INTERNAL · <span style={{ color: "#fbbf24", opacity: 0.6 }}>PAYMENT TOOLS</span>
      </Typography>
      <Typography sx={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900, color: "#e2e8f0", fontSize: 22, letterSpacing: -0.5, mb: 0.5 }}>Add Country</Typography>
      <Typography sx={{ fontFamily: "'Space Grotesk', sans-serif", color: "#a78bfacc", fontSize: 12, letterSpacing: 2, mb: 3 }}>// add a new country with its billing data</Typography>

      <form onSubmit={handleSubmit} autoComplete="off">
        <Paper sx={paperSx}>
          <SectionLabel step="01" title="General Info" />
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField label="Country Name" name="nombre" value={form.nombre} onChange={handleChange} fullWidth required placeholder="e.g: mexico" sx={inputSx} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Default Amount" name="amount" value={form.amount} onChange={handleChange} fullWidth required placeholder="500.00" sx={inputSx} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Currency" name="currency" value={form.currency} onChange={handleChange} fullWidth required placeholder="e.g: MXN" sx={inputSx} />
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={paperSx}>
          <SectionLabel step="02" title="Billing Address" />
          <Grid container spacing={2}>
            <Grid item xs={6} sm={4} md={2}>
              <TextField label="Country Code" name="billing_address.country" value={form.billing_address.country} onChange={handleChange} fullWidth required placeholder="e.g: MX" sx={inputSx} />
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <TextField label="State" name="billing_address.state" value={form.billing_address.state} onChange={handleChange} fullWidth required sx={inputSx} />
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <TextField label="City" name="billing_address.city" value={form.billing_address.city} onChange={handleChange} fullWidth required sx={inputSx} />
            </Grid>
            <Grid item xs={6} sm={6} md={4}>
              <TextField label="Address" name="billing_address.address" value={form.billing_address.address} onChange={handleChange} fullWidth required sx={inputSx} />
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <TextField label="ZIP" name="billing_address.zip" value={form.billing_address.zip} onChange={handleChange} fullWidth required sx={inputSx} />
            </Grid>
            <Grid item xs={12} sm={9} md={6}>
              <TextField label="Phone" name="billing_address.phone" value={form.billing_address.phone} onChange={handleChange} fullWidth required placeholder="e.g: +521234567890" sx={inputSx} />
            </Grid>
          </Grid>
        </Paper>

        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Button type="submit" variant="contained" size="large"
            sx={{
              minWidth: 220, fontWeight: 700, fontSize: 11, letterSpacing: 4, textTransform: "uppercase",
              fontFamily: "'Space Grotesk', sans-serif", background: "transparent", color: "#a78bfa",
              border: "1px solid #a78bfa55", borderRadius: 0, px: 5, py: 1.5,
              boxShadow: "0 0 12px #a78bfa11",
              "&:hover": { color: "#fbbf24", borderColor: "#fbbf24", bgcolor: "transparent", boxShadow: "0 0 20px #fbbf2433" }
            }}>
            Save Country
          </Button>
        </Box>
      </form>

      {success && (
        <Alert severity="success" onClose={() => setSuccess("")}
          sx={{ mb: 2, bgcolor: "#04080a", color: "#4ade80", borderLeft: "2px solid #22c55e", borderRadius: 0, fontFamily: "'Space Grotesk', sans-serif", fontSize: 12 }}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" onClose={() => setError("")}
          sx={{ bgcolor: "#08040a", color: "#f87171", borderLeft: "2px solid #ef4444", borderRadius: 0, fontFamily: "'Space Grotesk', sans-serif", fontSize: 12 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}

