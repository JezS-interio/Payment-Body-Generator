import React, { useState, useEffect } from "react";
import {
  Box, Grid, TextField, Button, Typography, MenuItem, Alert,
  Switch, FormControlLabel, Paper, Divider, Tooltip
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import DownloadIcon from "@mui/icons-material/Download";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import axios from "axios";

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
  "& input": { color: "#e2e8f0", fontFamily: "monospace", fontSize: 13 },
  "& .MuiSelect-select": { color: "#e2e8f0", fontFamily: "monospace", fontSize: 13 },
};

function SectionLabel({ step, title }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2.5 }}>
      <Typography sx={{ color: "#fbbf24", fontFamily: "monospace", fontSize: 11, fontWeight: 900, letterSpacing: 1, whiteSpace: "nowrap" }}>
        [{step}]
      </Typography>
      <Typography sx={{ color: "#c4b5fd", fontFamily: "monospace", fontSize: 11, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", whiteSpace: "nowrap" }}>
        {title}
      </Typography>
      <Box sx={{ flex: 1, height: "1px", background: "linear-gradient(90deg, #a78bfa33, transparent)" }} />
    </Box>
  );
}

const api = axios.create({ baseURL: process.env.NODE_ENV === "production" ? "/api" : "http://localhost:4000/api" });

export default function PaymentBody() {
  const [paises, setPaises] = useState({});
  const [methods, setMethods] = useState({});
  const [pais, setPais] = useState("");
  const [method, setMethod] = useState("");
  const [form, setForm] = useState({
    merchant_key: "",
    password: "",
    order_number: "1",
    order_description: "Purchase",
    amount: "",
    currency: "",
    cancel_url: "https://example.com/cancel",
    success_url: "https://example.com/success",
    error_url: "https://example.com/error",
    customer_name: "Test Name",
    customer_email: "test-s-interio@example.com",
    billing_address: {
      country: "",
      state: "",
      city: "",
      address: "",
      zip: "",
      phone: ""
    },
    recurring_init: true,
    req_token: true
  });
  const [body, setBody] = useState(null);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    api.get("/paises").then(r => {
      setPaises(r.data);
      const first = Object.keys(r.data)[0];
      setPais(first);
      setForm(f => ({ ...f, amount: r.data[first]?.amount || "", currency: r.data[first]?.currency || "", billing_address: { ...r.data[first]?.billing_address } }));
    }).catch(() => {});
    api.get("/methods").then(r => setMethods(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (pais && paises[pais]) {
      setForm(f => ({ ...f, amount: paises[pais].amount, currency: paises[pais].currency, billing_address: { ...paises[pais].billing_address } }));
      setMethod("");
    }
  }, [pais]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("billing_address.")) {
      const key = name.split(".")[1];
      setForm(f => ({ ...f, billing_address: { ...f.billing_address, [key]: value } }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSwitch = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccess("");
    setBody(null);
    try {
      const res = await api.post("/generar-body", {
        ...form,
        method: method || undefined
      });
      setBody(res.data.body);
      setSuccess("Body generated successfully.");
    } catch (err) {
      setErrors(err.response?.data?.errores || [err.message]);
    }
  };

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(body, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const paperSx = { p: 3, mb: 2, bgcolor: "#0a0a12", border: "1px solid #a78bfa1e", borderRadius: 0 };

  return (
    <Box sx={{ pb: 4 }}>
      <Typography sx={{ fontFamily: "monospace", color: "#a78bfaaa", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", mb: 1 }}>
        INTERNAL · <span style={{ color: "#fbbf24", opacity: 0.6 }}>PAYMENT TOOLS</span>
      </Typography>
      <Typography sx={{ fontFamily: "monospace", fontWeight: 900, color: "#e2e8f0", fontSize: 22, letterSpacing: -0.5, mb: 0.5 }}>Payment Body Generator</Typography>
      <Typography sx={{ fontFamily: "monospace", color: "#a78bfacc", fontSize: 12, letterSpacing: 2, mb: 3 }}>// build the payment request for any LatAm country</Typography>

      <form onSubmit={handleSubmit} autoComplete="off">
        {/* MERCHANT */}
        <Paper sx={paperSx}>
          <SectionLabel step="01" title="Merchant" />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField label="merchant_key" name="merchant_key" value={form.merchant_key} onChange={handleChange} fullWidth required placeholder="tu-merchant-key" sx={inputSx} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="password" name="password" value={form.password} onChange={handleChange} fullWidth required placeholder="tu-password" type="text" sx={inputSx} />
            </Grid>
          </Grid>
        </Paper>

        {/* COUNTRY + METHOD */}
        <Paper sx={paperSx}>
          <SectionLabel step="02" title="Country & Method" />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField select label="Country" value={pais} onChange={e => setPais(e.target.value)} fullWidth required sx={inputSx}>
                {Object.keys(paises).map(k => (
                  <MenuItem key={k} value={k}>
                    {paises[k]?.billing_address?.country} {k.charAt(0).toUpperCase() + k.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField select label="Payment Method" value={method} onChange={e => setMethod(e.target.value)} fullWidth sx={inputSx}>
                <MenuItem value="">— No method —</MenuItem>
                {(methods[pais] || []).map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
              </TextField>
            </Grid>
          </Grid>
        </Paper>

        {/* ORDER */}
        <Paper sx={paperSx}>
          <SectionLabel step="03" title="Order" />
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3} md={2}>
              <TextField label="Number" name="order_number" value={form.order_number} onChange={handleChange} fullWidth required sx={inputSx} />
            </Grid>
            <Grid item xs={6} sm={5} md={5}>
              <TextField label="Description" name="order_description" value={form.order_description} onChange={handleChange} fullWidth required sx={inputSx} />
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <TextField label="Amount" name="amount" value={form.amount} onChange={handleChange} fullWidth required sx={inputSx} />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <TextField label="Currency" name="currency" value={form.currency} fullWidth disabled sx={inputSx} />
            </Grid>
          </Grid>
        </Paper>

        {/* URLs */}
        <Paper sx={paperSx}>
          <SectionLabel step="04" title="URLs" />
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField label="Cancel URL" name="cancel_url" value={form.cancel_url} onChange={handleChange} fullWidth required sx={inputSx} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Success URL" name="success_url" value={form.success_url} onChange={handleChange} fullWidth required sx={inputSx} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Error URL" name="error_url" value={form.error_url} onChange={handleChange} fullWidth required sx={inputSx} />
            </Grid>
          </Grid>
        </Paper>

        {/* CUSTOMER */}
        <Paper sx={paperSx}>
          <SectionLabel step="05" title="Customer" />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField label="Name" name="customer_name" value={form.customer_name} onChange={handleChange} fullWidth required sx={inputSx} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Email" name="customer_email" value={form.customer_email} onChange={handleChange} fullWidth required sx={inputSx} />
            </Grid>
          </Grid>
        </Paper>

        {/* BILLING ADDRESS */}
        <Paper sx={paperSx}>
          <SectionLabel step="06" title="Billing Address" />
          <Grid container spacing={2}>
            <Grid item xs={6} sm={4} md={2}>
              <TextField label="Country" name="billing_address.country" value={form.billing_address.country} onChange={handleChange} fullWidth required sx={inputSx} />
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
              <TextField label="Phone" name="billing_address.phone" value={form.billing_address.phone} onChange={handleChange} fullWidth required sx={inputSx} />
            </Grid>
          </Grid>
        </Paper>

        {/* FLAGS */}
        <Paper sx={paperSx}>
          <SectionLabel step="07" title="Flags" />
          <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            <FormControlLabel
              control={<Switch checked={form.recurring_init} onChange={handleSwitch} name="recurring_init" color="primary" />}
              label={<Typography sx={{ color: "#a78bfa", fontFamily: "monospace", fontWeight: 600, fontSize: 12, letterSpacing: 2 }}>recurring_init</Typography>}
            />
            <FormControlLabel
              control={<Switch checked={form.req_token} onChange={handleSwitch} name="req_token" color="primary" />}
              label={<Typography sx={{ color: "#a78bfa", fontFamily: "monospace", fontWeight: 600, fontSize: 12, letterSpacing: 2 }}>req_token</Typography>}
            />
          </Box>
        </Paper>

        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Button type="submit" variant="outlined" size="large"
            sx={{
              minWidth: 220, fontWeight: 700, fontSize: 11, letterSpacing: 4, textTransform: "uppercase",
              fontFamily: "monospace", background: "transparent", color: "#a78bfa",
              border: "1px solid #a78bfa55", borderRadius: 0, px: 5, py: 1.5,
              boxShadow: "0 0 12px #a78bfa11",
              "&:hover": { color: "#fbbf24", borderColor: "#fbbf24", bgcolor: "transparent", boxShadow: "0 0 20px #fbbf2433" }
            }}>
            Generate Body
          </Button>
        </Box>
      </form>

      {errors.length > 0 && (
        <Box sx={{ mb: 2 }}>
          {errors.map((e, i) => (
            <Alert key={i} severity="error" onClose={() => setErrors(prev => prev.filter((_, j) => j !== i))}
              sx={{ mb: 1, bgcolor: "#08040a", color: "#f87171", borderLeft: "2px solid #ef4444", borderRadius: 0, fontFamily: "monospace", fontSize: 12 }}>
              {e}
            </Alert>
          ))}
        </Box>
      )}

      {success && (
        <Alert severity="success" onClose={() => setSuccess("")}
          sx={{ mb: 2, bgcolor: "#04080a", color: "#4ade80", borderLeft: "2px solid #22c55e", borderRadius: 0, fontFamily: "monospace", fontSize: 12 }}>
          {success}
        </Alert>
      )}

      {body && (
        <Paper sx={{ p: 3, bgcolor: "#080810", border: "1px solid #a78bfa44", borderRadius: 0, boxShadow: "0 0 24px #a78bfa0a" }}>
          <SectionLabel step="OUT" title="Final Body" />
          <Box sx={{ bgcolor: "#04040a", p: 2, overflowX: "auto", border: "1px solid #a78bfa1e" }}>
            <pre style={{ margin: 0, color: "#a78bfa", fontSize: 12, fontFamily: "monospace", lineHeight: 1.8 }}>
              {JSON.stringify(body, null, 2)}
            </pre>
          </Box>
          <Box sx={{ display: "flex", gap: 1.5, mt: 2, flexWrap: "wrap" }}>
            <Tooltip title={copied ? "Copied!" : "Copy to paste in Postman"} arrow>
              <Button
                variant="contained"
                startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
                onClick={handleCopy}
                sx={{
                  fontWeight: 700, fontSize: 10, letterSpacing: 3, textTransform: "uppercase",
                  fontFamily: "monospace", borderRadius: 0, px: 3, py: 1,
                  background: "transparent",
                  color: copied ? "#22c55e" : "#a78bfa",
                  border: `1px solid ${copied ? "#22c55e44" : "#a78bfa44"}`,
                  boxShadow: copied ? "0 0 10px #22c55e1a" : "none",
                  transition: "all 0.2s",
                  "&:hover": { borderColor: "#a78bfa", bgcolor: "transparent", boxShadow: "0 0 10px #a78bfa22" }
                }}>
                {copied ? "Copied!" : "Copy Body"}
              </Button>
            </Tooltip>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              sx={{
                fontWeight: 700, fontSize: 10, letterSpacing: 3, textTransform: "uppercase",
                fontFamily: "monospace", borderRadius: 0, px: 3, py: 1,
                background: "transparent", color: "#fbbf24",
                border: "1px solid #fbbf2433",
                "&:hover": { borderColor: "#fbbf24", bgcolor: "transparent", boxShadow: "0 0 10px #fbbf2422" }
              }}
              onClick={() => {
                const blob = new Blob([JSON.stringify(body, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url; a.download = "body.json"; a.click();
                URL.revokeObjectURL(url);
              }}>
              Download .json
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
}
