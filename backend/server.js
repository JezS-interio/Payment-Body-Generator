import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 4000;
const dataDir = path.join(__dirname, "data");

app.use(cors());
app.use(express.json());

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(dataDir, file), "utf-8"));
}
function writeJson(file, data) {
  fs.writeFileSync(path.join(dataDir, file), JSON.stringify(data, null, 2), "utf-8");
}

// ========== VALIDACIONES ==========
function validarAmount(valor) {
  valor = valor.trim();
  if (!valor) return [false, "El amount no puede estar vacío"];
  if (valor.includes(",")) return [false, "Usá punto y no coma. Ejemplo: 500.00"];
  if (!/^\d+(\.\d{1,2})?$/.test(valor)) return [false, "Formato inválido. Ejemplo válido: 500 o 500.00"];
  const numero = parseFloat(valor);
  if (isNaN(numero)) return [false, "Número inválido"];
  if (numero <= 0) return [false, "El amount debe ser mayor a 0"];
  if (numero > 999999999999.99) return [false, "El amount es demasiado grande"];
  return [true, ""];
}
function validarPhone(valor) {
  valor = valor.trim();
  if (!valor) return [false, "El teléfono no puede estar vacío"];
  if (!valor.startsWith("+")) return [false, "El teléfono debe empezar con +"];
  if (!/^\+\d+$/.test(valor)) return [false, "El teléfono solo puede tener + y números"];
  const digitos = valor.slice(1);
  if (digitos.length < 8) return [false, "El teléfono es demasiado corto"];
  if (digitos.length > 15) return [false, "El teléfono es demasiado largo"];
  return [true, ""];
}
function generarHash(order_number, order_amount, order_currency, order_description, password) {
  const stringToHash = (order_number + order_amount + order_currency + order_description + password).toUpperCase();
  const md5 = crypto.createHash("md5").update(stringToHash).digest("hex");
  const sha1 = crypto.createHash("sha1").update(md5).digest("hex");
  return sha1;
}

// ========== ENDPOINTS =============
app.get("/api/paises", (req, res) => {
  res.json(readJson("paises.json"));
});
app.get("/api/documentos", (req, res) => {
  res.json(readJson("documentos.json"));
});
app.get("/api/methods", (req, res) => {
  res.json(readJson("methods.json"));
});

app.post("/api/paises", (req, res) => {
  const { nombre, amount, currency, billing_address } = req.body;
  if (!nombre || !amount || !currency || !billing_address) return res.status(400).json({ error: "Faltan campos" });
  const paises = readJson("paises.json");
  if (paises[nombre]) return res.status(400).json({ error: "El país ya existe" });
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
  if (!pais || !method) return res.status(400).json({ error: "Faltan campos" });
  const methods = readJson("methods.json");
  if (!methods[pais]) methods[pais] = [];
  if (methods[pais].includes(method)) return res.status(400).json({ error: "Ese method ya existe para este país" });
  methods[pais].push(method);
  writeJson("methods.json", methods);
  res.json({ success: true });
});

app.post("/api/generar-body", (req, res) => {
  const {
    merchant_key, password, order_number, order_description, amount, currency, method, cancel_url, success_url, error_url,
    customer_name, customer_email, billing_address, recurring_init, req_token
  } = req.body;
  let errores = [];
  if (!merchant_key?.trim()) errores.push("merchant_key es obligatorio");
  if (!password?.trim()) errores.push("password es obligatorio");
  if (!order_number?.trim()) errores.push("Order number es obligatorio");
  if (!order_description?.trim()) errores.push("Order description es obligatorio");
  const [okAmount, errAmount] = validarAmount(amount);
  if (!okAmount) errores.push(`Amount: ${errAmount}`);
  const [okPhone, errPhone] = validarPhone(billing_address?.phone || "");
  if (!okPhone) errores.push(`Phone: ${errPhone}`);
  if (!cancel_url?.trim() || !success_url?.trim() || !error_url?.trim()) errores.push("Las URLs no pueden estar vacías");
  if (errores.length) return res.status(400).json({ errores });
  const amount_fmt = parseFloat(amount).toFixed(2);
  const hash = generarHash(order_number, amount_fmt, currency, order_description, password);
  const body = {
    merchant_key,
    operation: "purchase",
    ...(method ? { methods: [method] } : {}),
    order: {
      number: order_number,
      amount: amount_fmt,
      currency,
      description: order_description
    },
    cancel_url,
    success_url,
    error_url,
    customer: {
      name: customer_name,
      email: customer_email
    },
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

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
