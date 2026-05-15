const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());

const dataDir = path.join(__dirname, "../backend/data");

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(dataDir, file), "utf-8"));
}
function writeJson(file, data) {
  fs.writeFileSync(path.join(dataDir, file), JSON.stringify(data, null, 2), "utf-8");
}

function validarAmount(valor) {
  valor = valor.trim();
  if (!valor) return [false, "Amount cannot be empty"];
  if (valor.includes(",")) return [false, "Use a dot, not a comma. Example: 500.00"];
  if (!/^\d+(\.\d{1,2})?$/.test(valor)) return [false, "Invalid format. Valid example: 500 or 500.00"];
  const numero = parseFloat(valor);
  if (isNaN(numero)) return [false, "Invalid number"];
  if (numero <= 0) return [false, "Amount must be greater than 0"];
  if (numero > 999999999999.99) return [false, "Amount is too large"];
  return [true, ""];
}

function validarPhone(valor) {
  valor = valor.trim();
  if (!valor) return [false, "Phone cannot be empty"];
  if (!valor.startsWith("+")) return [false, "Phone must start with +"];
  if (!/^\+\d+$/.test(valor)) return [false, "Phone can only contain + and digits"];
  const digitos = valor.slice(1);
  if (digitos.length < 8) return [false, "Phone is too short"];
  if (digitos.length > 15) return [false, "Phone is too long"];
  return [true, ""];
}

function generarHash(order_number, order_amount, order_currency, order_description, password) {
  const stringToHash = (order_number + order_amount + order_currency + order_description + password).toUpperCase();
  const md5 = crypto.createHash("md5").update(stringToHash).digest("hex");
  const sha1 = crypto.createHash("sha1").update(md5).digest("hex");
  return sha1;
}

app.get("/api/paises", (req, res) => res.json(readJson("paises.json")));
app.get("/api/documentos", (req, res) => res.json(readJson("documentos.json")));
app.get("/api/methods", (req, res) => res.json(readJson("methods.json")));

app.post("/api/paises", (req, res) => {
  const { nombre, amount, currency, billing_address } = req.body;
  if (!nombre || !amount || !currency || !billing_address)
    return res.status(400).json({ error: "Missing fields" });
  const paises = readJson("paises.json");
  if (paises[nombre]) return res.status(400).json({ error: "Country already exists" });
  const [okAmount, errAmount] = validarAmount(amount);
  if (!okAmount) return res.status(400).json({ error: errAmount });
  const [okPhone, errPhone] = validarPhone(billing_address.phone);
  if (!okPhone) return res.status(400).json({ error: errPhone });
  paises[nombre] = {
    amount: parseFloat(amount).toFixed(2),
    currency: currency.trim().toUpperCase(),
    billing_address: {
      country: billing_address.country.trim().toUpperCase(),
      state: billing_address.state.trim(),
      city: billing_address.city.trim(),
      address: billing_address.address.trim(),
      zip: billing_address.zip.trim(),
      phone: billing_address.phone.trim()
    }
  };
  writeJson("paises.json", paises);
  res.json({ success: true });
});

app.post("/api/methods", (req, res) => {
  const { pais, method } = req.body;
  if (!pais || !method) return res.status(400).json({ error: "Missing fields" });
  const methods = readJson("methods.json");
  if (!methods[pais]) methods[pais] = [];
  if (methods[pais].includes(method))
    return res.status(400).json({ error: "Method already exists for this country" });
  methods[pais].push(method);
  writeJson("methods.json", methods);
  res.json({ success: true });
});

app.post("/api/generar-body", (req, res) => {
  const {
    merchant_key, password, order_number, order_description, amount, currency,
    method, cancel_url, success_url, error_url, customer_name, customer_email,
    billing_address, recurring_init, req_token
  } = req.body;
  let errores = [];
  if (!merchant_key?.trim()) errores.push("merchant_key is required");
  if (!password?.trim()) errores.push("password is required");
  if (!order_number?.trim()) errores.push("Order number is required");
  if (!order_description?.trim()) errores.push("Order description is required");
  const [okAmount, errAmount] = validarAmount(amount || "");
  if (!okAmount) errores.push(`Amount: ${errAmount}`);
  const [okPhone, errPhone] = validarPhone(billing_address?.phone || "");
  if (!okPhone) errores.push(`Phone: ${errPhone}`);
  if (!cancel_url?.trim() || !success_url?.trim() || !error_url?.trim())
    errores.push("URLs cannot be empty");
  if (errores.length) return res.status(400).json({ errores });
  const amount_fmt = parseFloat(amount).toFixed(2);
  const hash = generarHash(order_number, amount_fmt, currency, order_description, password);
  const body = {
    merchant_key,
    operation: "purchase",
    ...(method ? { methods: [method] } : {}),
    order: { number: order_number, amount: amount_fmt, currency, description: order_description },
    cancel_url, success_url, error_url,
    customer: { name: customer_name, email: customer_email },
    billing_address: {
      country: billing_address.country.toUpperCase(),
      state: billing_address.state,
      city: billing_address.city,
      address: billing_address.address,
      zip: billing_address.zip,
      phone: billing_address.phone
    },
    recurring_init: !!recurring_init,
    req_token: !!req_token,
    hash
  };
  res.json({ body });
});

module.exports = app;
