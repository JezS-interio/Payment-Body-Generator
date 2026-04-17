# Payment Body Generator
# by Jezabel Rosso
# Para ejecutar cd "C:\Users\acer\Desktop\Programas\Postman2 y luego py -m streamlit run app.py
# ====== ``` Para comentario el telegram


import json
import hashlib
import re
import copy
import streamlit as st
import streamlit.components.v1 as components

# ================= CONFIGURACIÓN =================
st.set_page_config(
    page_title="S-interio",
    page_icon=None,
    layout="wide",
    initial_sidebar_state="expanded",
    menu_items={}
)

# ================= ESTILOS =================
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

    html, body, [class*="css"] {
        font-family: 'Inter', sans-serif;
    }

    /* Ocultar logo/icono del buscador de Streamlit */
    [data-testid="stDecoration"],
    #MainMenu,
    header[data-testid="stHeader"],
    .stDeployButton,
    footer {
        display: none !important;
        visibility: hidden !important;
    }

    .stApp {
        background-color: #f8f9fc;
        color: #1e293b;
    }

    .block-container {
        padding-top: 2.5rem;
        max-width: 1100px;
    }

    /* Sidebar - siempre visible, sin botón de colapso */
    /* Sidebar fijo y siempre visible */
    [data-testid="stSidebar"] {
        background-color: #ffffff;
        border-right: 1px solid #e2e8f0;
        box-shadow: 2px 0 8px rgba(0,0,0,0.04);
        min-width: 240px !important;
        max-width: 240px !important;
        width: 240px !important;
        transform: translateX(0%) !important;
        margin-left: 0 !important;
    }

    /* Que el contenido del sidebar también quede visible */
    [data-testid="stSidebar"] > div:first-child {
        min-width: 240px !important;
        max-width: 240px !important;
        width: 240px !important;
    }

    /* Ocultar botones de colapsar/expandir */
    [data-testid="stSidebarCollapseButton"],
    [data-testid="collapsedControl"] {
        display: none !important;
        visibility: hidden !important;
    }

    /* Ocultar el botón de colapsar sidebar */
    [data-testid="stSidebarCollapseButton"],
    [data-testid="collapsedControl"] {
        display: none !important;
    }

    [data-testid="stSidebar"] .block-container {
        padding-top: 2rem;
    }

    .brand {
        font-size: 1.3rem;
        font-weight: 700;
        color: #1e293b;
        letter-spacing: -0.5px;
        margin-bottom: 2px;
    }

    .brand span {
        color: #7c3aed;
    }

    .brand-sub {
        font-size: 0.68rem;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 2px;
        margin-bottom: 2rem;
    }

    .page-title {
        font-size: 1.6rem;
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 4px;
        letter-spacing: -0.3px;
    }

    .page-sub {
        font-size: 0.85rem;
        color: #94a3b8;
        margin-bottom: 2rem;
    }

    .section-label {
        font-size: 0.68rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 2px;
        color: #7c3aed;
        margin-top: 1.5rem;
        margin-bottom: 0.6rem;
    }

    /* Inputs */
    .stTextInput > div > div > input,
    .stNumberInput > div > div > input {
        background-color: #ffffff !important;
        border: 1px solid #e2e8f0 !important;
        border-radius: 8px !important;
        color: #1e293b !important;
        font-family: 'Inter', sans-serif !important;
        font-size: 0.875rem !important;
        box-shadow: 0 1px 2px rgba(0,0,0,0.04) !important;
    }

    .stTextInput > div > div > input:focus {
        border-color: #7c3aed !important;
        box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.12) !important;
    }

    div[data-baseweb="select"] > div {
        background-color: #ffffff !important;
        border-color: #e2e8f0 !important;
        color: #1e293b !important;
        border-radius: 8px !important;
        box-shadow: 0 1px 2px rgba(0,0,0,0.04) !important;
    }

    .stSelectbox label, .stTextInput label,
    .stCheckbox label, .stNumberInput label {
        color: #64748b !important;
        font-size: 0.8rem !important;
        font-weight: 500 !important;
    }

    /* Botones sidebar */
    [data-testid="stSidebar"] .stButton > button {
        background-color: transparent !important;
        color: #64748b !important;
        border: none !important;
        border-radius: 8px !important;
        text-align: left !important;
        font-size: 0.85rem !important;
        font-weight: 400 !important;
        padding: 0.5rem 0.75rem !important;
        width: 100% !important;
        transition: all 0.15s !important;
        letter-spacing: 0 !important;
        text-transform: none !important;
        box-shadow: none !important;
    }

    [data-testid="stSidebar"] .stButton > button:hover {
        background-color: #f1f0fe !important;
        color: #7c3aed !important;
        transform: none !important;
        box-shadow: none !important;
    }

    /* Botón de acción principal */
    .stButton > button {
        background-color: #7c3aed !important;
        color: #ffffff !important;
        border: none !important;
        border-radius: 8px !important;
        font-size: 0.85rem !important;
        font-weight: 600 !important;
        padding: 0.6rem 1.5rem !important;
        width: 100% !important;
        transition: all 0.2s !important;
        text-transform: none !important;
        letter-spacing: 0 !important;
        box-shadow: 0 2px 8px rgba(124, 58, 237, 0.25) !important;
    }

    .stButton > button:hover {
        background-color: #6d28d9 !important;
        transform: translateY(-1px) !important;
        box-shadow: 0 6px 20px rgba(124, 58, 237, 0.35) !important;
    }

    .stDownloadButton > button {
        background-color: transparent !important;
        color: #7c3aed !important;
        border: 1.5px solid #7c3aed !important;
        border-radius: 8px !important;
        font-size: 0.82rem !important;
        font-weight: 500 !important;
        width: 100% !important;
        transition: all 0.2s !important;
        box-shadow: none !important;
    }

    .stDownloadButton > button:hover {
        background-color: #f1f0fe !important;
    }

    .json-output {
        background-color: #1e1b4b;
        border: 1px solid #c4b5fd;
        border-left: 4px solid #7c3aed;
        border-radius: 10px;
        padding: 1.25rem 1.5rem;
        font-family: 'Courier New', monospace;
        font-size: 0.78rem;
        line-height: 1.7;
        color: #c4b5fd;
        white-space: pre;
        overflow-x: auto;
        max-height: 480px;
        overflow-y: auto;
    }

    .stSuccess > div {
        background-color: #f0fdf4 !important;
        border-left: 3px solid #22c55e !important;
        border-radius: 8px !important;
        color: #166534 !important;
    }

    .stError > div {
        background-color: #fef2f2 !important;
        border-left: 3px solid #ef4444 !important;
        border-radius: 8px !important;
        color: #991b1b !important;
    }

    .stInfo > div {
        background-color: #f5f3ff !important;
        border-left: 3px solid #7c3aed !important;
        border-radius: 8px !important;
        color: #5b21b6 !important;
    }

    .stWarning > div {
        background-color: #fffbeb !important;
        border-left: 3px solid #f59e0b !important;
        border-radius: 8px !important;
        color: #92400e !important;
    }

    .stCheckbox label {
        color: #475569 !important;
    }

    .streamlit-expanderHeader {
        background-color: #f8f9fc !important;
        border-radius: 8px !important;
        color: #475569 !important;
        font-size: 0.85rem !important;
    }

    .tag {
        display: inline-block;
        font-size: 0.72rem;
        padding: 3px 10px;
        background-color: #f1f0fe;
        border: 1px solid #c4b5fd;
        border-radius: 20px;
        color: #7c3aed;
        margin-right: 6px;
        margin-bottom: 6px;
        font-weight: 500;
    }

    hr {
        border-color: #e2e8f0 !important;
    }

    .footer {
        font-size: 0.65rem;
        color: #cbd5e1;
        text-align: center;
        margin-top: 2rem;
        letter-spacing: 1px;
        text-transform: uppercase;
    }

</style>
""", unsafe_allow_html=True)

# ================= HASH =================
def generar_hash(order_number, order_amount, order_currency, order_description, password):
    string_to_hash = (
        order_number + order_amount + order_currency + order_description + password
    ).upper()
    md5_hash = hashlib.md5(string_to_hash.encode()).hexdigest()
    sha1_hash = hashlib.sha1(md5_hash.encode()).hexdigest()
    return sha1_hash


# ================= VALIDACIONES =================
def validar_amount(valor):
    valor = valor.strip()
    if not valor:
        return False, "El amount no puede estar vacío"
    if "," in valor:
        return False, "Usá punto y no coma. Ejemplo: 500.00"
    if not re.fullmatch(r"[0-9]+(\.[0-9]{1,2})?", valor):
        return False, "Formato inválido. Ejemplo válido: 500 o 500.00"
    try:
        numero = float(valor)
    except ValueError:
        return False, "Número inválido"
    if numero <= 0:
        return False, "El amount debe ser mayor a 0"
    if numero > 999999999999.99:
        return False, "El amount es demasiado grande"
    return True, ""


def validar_phone(valor):
    valor = valor.strip()
    if not valor:
        return False, "El teléfono no puede estar vacío"
    if not valor.startswith("+"):
        return False, "El teléfono debe empezar con +"
    if not re.fullmatch(r"\+\d+", valor):
        return False, "El teléfono solo puede tener + y números"
    digitos = valor[1:]
    if len(digitos) < 8:
        return False, "El teléfono es demasiado corto"
    if len(digitos) > 15:
        return False, "El teléfono es demasiado largo"
    return True, ""


# ================= CARGA DE DATOS =================
@st.cache_data
def cargar_paises():
    try:
        with open("paises.json", "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return {
            "argentina": {
                "amount": "1000.00",
                "currency": "ARS",
                "billing_address": {
                    "country": "AR",
                    "state": "Buenos Aires",
                    "city": "Buenos Aires",
                    "address": "Av. Corrientes 1234",
                    "zip": "1043",
                    "phone": "+541112345678"
                }
            }
        }


@st.cache_data
def cargar_documentos():
    try:
        with open("documentos.json", "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return {}


@st.cache_data
def cargar_methods():
    try:
        with open("methods.json", "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return {}


def guardar_json(nombre, data):
    with open(nombre, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


# ================= SESSION STATE =================
# ================= SESSION STATE =================
if "paises" not in st.session_state:
    st.session_state.paises = cargar_paises()
if "documentos" not in st.session_state:
    st.session_state.documentos = cargar_documentos()
if "methods_data" not in st.session_state:
    st.session_state.methods_data = cargar_methods()
if "body_generado" not in st.session_state:
    st.session_state.body_generado = {}
if "active_tab" not in st.session_state:
    st.session_state.active_tab = "Generar Body"
if "merchant_key" not in st.session_state:
    st.session_state.merchant_key = ""
if "password" not in st.session_state:
    st.session_state.password = ""


# ================= SIDEBAR =================
with st.sidebar:
    st.markdown('<div class="brand">S-<span>interio</span></div>', unsafe_allow_html=True)
    st.markdown('<div class="brand-sub">Payment Body Generator</div>', unsafe_allow_html=True)
    st.markdown("---")

    nav_items = [
        ("Generar Body",   "Generar Body"),
        ("Ver Documentos", "Ver Documentos"),
        ("Agregar Pais",   "Agregar País"),
        ("Ver Paises",     "Ver Países"),
        ("Agregar Method", "Agregar Method"),
    ]

    for key, label in nav_items:
        if st.button(label, key=f"nav_{key}"):
            st.session_state.active_tab = key

    st.markdown("---")
    st.markdown('<div class="footer">by Jezabel Rosso</div>', unsafe_allow_html=True)

tab = st.session_state.active_tab


# ================= TAB: GENERAR BODY =================
if tab == "Generar Body":
    st.markdown('<div class="page-title">Generar Body</div>', unsafe_allow_html=True)
    st.markdown('<div class="page-sub">Completá los datos para construir el request de pago.</div>', unsafe_allow_html=True)

    paises = st.session_state.paises
    methods_data = st.session_state.methods_data

    if not paises:
        st.warning("No hay países cargados. Agregá uno primero.")
    else:
        col_left, col_right = st.columns([1, 1], gap="large")

        with col_left:
            st.markdown('<div class="section-label">Configuracion base</div>', unsafe_allow_html=True)
            pais_sel = st.selectbox("País", list(paises.keys()), format_func=lambda x: x.capitalize())
            base = copy.deepcopy(paises[pais_sel])

            merchant_key = st.text_input(
                "merchant_key",
                value=st.session_state.merchant_key,
                placeholder="tu-merchant-key",
                key="merchant_key_input"
            )

            password = st.text_input(
                "password",
                value=st.session_state.password,
                placeholder="tu-password",
                key="password_input"
            )

            st.session_state.merchant_key = merchant_key
            st.session_state.password = password

            st.markdown('<div class="section-label">Orden</div>', unsafe_allow_html=True)
            order_number      = st.text_input("Order number", value="1")
            order_description = st.text_input("Order description", value="Compra")
            amount_input      = st.text_input("Amount", value=base.get("amount", "100.00"))
            currency          = st.text_input("Currency", value=base.get("currency", "USD"), disabled=True)

            lista_metodos = methods_data.get(pais_sel, [])
            method_sel = None
            if lista_metodos:
                if len(lista_metodos) == 1:
                    method_sel = lista_metodos[0]
                    st.info(f"Method automático: {method_sel}")
                else:
                    st.markdown('<div class="section-label">Method</div>', unsafe_allow_html=True)
                    usar_method = st.checkbox("Elegir method")
                    if usar_method:
                        method_sel = st.selectbox("Method", lista_metodos)

        with col_right:
            st.markdown('<div class="section-label">URLs</div>', unsafe_allow_html=True)
            cancel_url  = st.text_input("Cancel URL",  value="https://example.com/cancel")
            success_url = st.text_input("Success URL", value="https://example.com/success")
            error_url   = st.text_input("Error URL",   value="https://example.com/error")

            st.markdown('<div class="section-label">Customer</div>', unsafe_allow_html=True)
            default_name = "Test Test2" if pais_sel == "peru" else "Test"
            customer_name = st.text_input("Name", value=default_name)
            customer_email = st.text_input("Email", value="test-s-interio@example.com")

            st.markdown('<div class="section-label">Billing Address</div>', unsafe_allow_html=True)
            ba        = base.get("billing_address", {})
            b_country = st.text_input("Country", value=ba.get("country", ""))
            b_state   = st.text_input("State",   value=ba.get("state", ""))
            b_city    = st.text_input("City",    value=ba.get("city", ""))
            b_address = st.text_input("Address", value=ba.get("address", ""))
            b_zip     = st.text_input("ZIP",     value=ba.get("zip", ""))
            b_phone   = st.text_input("Phone",   value=ba.get("phone", ""))

            st.markdown('<div class="section-label">Flags</div>', unsafe_allow_html=True)
            recurring_init = st.checkbox("recurring_init", value=False)
            req_token      = st.checkbox("req_token",      value=False)

        st.markdown("---")

        if st.button("Generar Body"):
            errores = []

            if not merchant_key.strip():
                errores.append("merchant_key es obligatorio")
            if not password.strip():
                errores.append("password es obligatorio")
            if not order_number.strip():
                errores.append("Order number es obligatorio")
            if not order_description.strip():
                errores.append("Order description es obligatorio")

            ok_amount, err_amount = validar_amount(amount_input)
            if not ok_amount:
                errores.append(f"Amount: {err_amount}")

            ok_phone, err_phone = validar_phone(b_phone)
            if not ok_phone:
                errores.append(f"Phone: {err_phone}")

            if not cancel_url.strip() or not success_url.strip() or not error_url.strip():
                errores.append("Las URLs no pueden estar vacías")

            if errores:
                for e in errores:
                    st.error(e)
            else:
                amount_fmt = f"{float(amount_input):.2f}"

                hash_final = generar_hash(
                    order_number, amount_fmt, currency, order_description, password
                )

                body = {
                    "merchant_key": merchant_key,
                    "operation": "purchase"
                }

                if method_sel:
                    body["methods"] = [method_sel]

                body.update({
                    "order": {
                        "number": order_number,
                        "amount": amount_fmt,
                        "currency": currency,
                        "description": order_description
                    },
                    "cancel_url": cancel_url,
                    "success_url": success_url,
                    "error_url": error_url,
                    "customer": {
                        "name": customer_name,
                        "email": customer_email
                    },
                    "billing_address": {
                        "country": b_country.upper(),
                        "state": b_state,
                        "city": b_city,
                        "address": b_address,
                        "zip": b_zip,
                        "phone": b_phone
                    },
                    "recurring_init": recurring_init,
                    "req_token": req_token,
                    "hash": hash_final
                })

                st.session_state.body_generado = body
                st.success("Body generado correctamente.")

    if isinstance(st.session_state.body_generado, dict) and st.session_state.body_generado:
        st.markdown('<div class="section-label">Body final</div>', unsafe_allow_html=True)
        body_str = json.dumps(st.session_state.body_generado, indent=2, ensure_ascii=False)
        body_js = json.dumps(body_str)

        st.markdown(f'<div class="json-output">{body_str}</div>', unsafe_allow_html=True)

        components.html(
            f"""
            <div style="margin-top:12px; margin-bottom:10px;">
                <button
                    onclick='navigator.clipboard.writeText({body_js})'
                    style="
                        width:100%;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        gap:8px;
                        padding:10px 14px;
                        border-radius:10px;
                        border:1px solid #e2e8f0;
                        background:#ffffff;
                        color:#334155;
                        font-size:0.85rem;
                        font-weight:500;
                        cursor:pointer;
                        transition:0.2s;
                    "
                    onmouseover="this.style.background='#f8fafc'; this.style.color='#7c3aed';"
                    onmouseout="this.style.background='#ffffff'; this.style.color='#334155';"
                >
                    📋 Copiar body
                </button>
            </div>
            """,
            height=60,
        )

        st.download_button(
            label="Descargar body.json",
            data=body_str,
            file_name="body.json",
            mime="application/json"
        )

# ================= TAB: VER DOCUMENTOS =================
elif tab == "Ver Documentos":
    st.markdown('<div class="page-title">Ver Documentos</div>', unsafe_allow_html=True)
    st.markdown('<div class="page-sub">Documentos disponibles por país.</div>', unsafe_allow_html=True)

    documentos = st.session_state.documentos

    if not documentos:
        st.info("No hay documentos cargados.")
    else:
        pais_sel = st.selectbox("País", list(documentos.keys()), format_func=lambda x: x.capitalize())
        docs = documentos.get(pais_sel, [])

        if docs:
            st.markdown('<div class="section-label">Lista de documentos</div>', unsafe_allow_html=True)

        for i, d in enumerate(docs):
            texto_mostrar = d
            texto_copiar = d.split(":", 1)[1].strip() if ":" in d else d
            doc_js = json.dumps(texto_copiar)

            components.html(
                f"""
                <div style="margin-bottom:10px;">
                    <button
                        onclick='navigator.clipboard.writeText({doc_js})'
                        style="
                            width:100%;
                            text-align:left;
                            padding:10px 14px;
                            border-radius:20px;
                            border:1px solid #c4b5fd;
                            background:#f1f0fe;
                            color:#7c3aed;
                            font-size:0.85rem;
                            font-weight:500;
                            cursor:pointer;
                        "
                        title="Copiar documento"
                    >
                        {texto_mostrar}
                    </button>
                </div>
                """,
                height=50,
            )

# ================= TAB: AGREGAR PAÍS =================
elif tab == "Agregar Pais":
    st.markdown('<div class="page-title">Agregar País</div>', unsafe_allow_html=True)
    st.markdown('<div class="page-sub">Creá un nuevo país con sus datos de billing.</div>', unsafe_allow_html=True)

    with st.form("form_agregar_pais"):
        st.markdown('<div class="section-label">Datos generales</div>', unsafe_allow_html=True)
        nombre   = st.text_input("Nombre del país (ej: mexico)")
        amount   = st.text_input("Monto por defecto", placeholder="500.00")
        currency = st.text_input("Moneda (ej: MXN)")

        st.markdown('<div class="section-label">Billing Address</div>', unsafe_allow_html=True)
        country_code = st.text_input("Código país (ej: MX)")
        state        = st.text_input("Estado")
        city         = st.text_input("Ciudad")
        address      = st.text_input("Dirección")
        zip_code     = st.text_input("ZIP")
        phone        = st.text_input("Teléfono (ej: +521234567890)")

        submitted = st.form_submit_button("Guardar País")

        if submitted:
            errores = []
            nombre_clean = nombre.strip().lower()

            if not nombre_clean:
                errores.append("El nombre del país es obligatorio")
            if nombre_clean in st.session_state.paises:
                errores.append(f"El país '{nombre_clean}' ya existe")

            ok_amount, err_amount = validar_amount(amount)
            if not ok_amount:
                errores.append(f"Amount: {err_amount}")

            ok_phone, err_phone = validar_phone(phone)
            if not ok_phone:
                errores.append(f"Phone: {err_phone}")

            campos = {
                "currency": currency, "country": country_code,
                "state": state, "city": city,
                "address": address, "zip": zip_code
            }
            for campo, val in campos.items():
                if not val.strip():
                    errores.append(f"{campo} es obligatorio")

            if errores:
                for e in errores:
                    st.error(e)
            else:
                st.session_state.paises[nombre_clean] = {
                    "amount": f"{float(amount):.2f}",
                    "currency": currency.strip().upper(),
                    "billing_address": {
                        "country": country_code.strip().upper(),
                        "state": state.strip(),
                        "city": city.strip(),
                        "address": address.strip(),
                        "zip": zip_code.strip(),
                        "phone": phone.strip()
                    }
                }
                guardar_json("paises.json", st.session_state.paises)
                st.success(f"País '{nombre_clean}' guardado correctamente.")
                st.cache_data.clear()


# ================= TAB: VER PAÍSES =================
elif tab == "Ver Paises":
    st.markdown('<div class="page-title">Ver Países</div>', unsafe_allow_html=True)
    st.markdown('<div class="page-sub">Países actualmente configurados.</div>', unsafe_allow_html=True)

    paises = st.session_state.paises

    if not paises:
        st.info("No hay países cargados.")
    else:
        for nombre, data in paises.items():
            with st.expander(f"{nombre.capitalize()}  —  {data.get('currency', '?')}"):
                col1, col2 = st.columns(2)
                with col1:
                    st.markdown(f"**Amount:** `{data.get('amount', '-')}`")
                    st.markdown(f"**Currency:** `{data.get('currency', '-')}`")
                with col2:
                    ba = data.get("billing_address", {})
                    for k, v in ba.items():
                        st.markdown(f"**{k.capitalize()}:** `{v}`")


# ================= TAB: AGREGAR METHOD =================
elif tab == "Agregar Method":
    st.markdown('<div class="page-title">Agregar Method</div>', unsafe_allow_html=True)
    st.markdown('<div class="page-sub">Agregá un método de pago a un país.</div>', unsafe_allow_html=True)

    paises = st.session_state.paises
    methods_data = st.session_state.methods_data

    if not paises:
        st.warning("No hay países cargados.")
    else:
        with st.form("form_agregar_method"):
            pais_sel     = st.selectbox("País", list(paises.keys()), format_func=lambda x: x.capitalize())
            nuevo_method = st.text_input("Nuevo method", placeholder="ej: CARD, PIX, BOLETO")
            submitted    = st.form_submit_button("Agregar Method")

            if submitted:
                method_clean = nuevo_method.strip()
                if not method_clean:
                    st.error("El method no puede estar vacío")
                else:
                    if pais_sel not in methods_data:
                        methods_data[pais_sel] = []

                    if method_clean in methods_data[pais_sel]:
                        st.warning("Ese method ya existe para este país.")
                    else:
                        methods_data[pais_sel].append(method_clean)
                        st.session_state.methods_data = methods_data
                        guardar_json("methods.json", methods_data)
                        st.success(f"Method '{method_clean}' agregado a {pais_sel.capitalize()}.")
                        st.cache_data.clear()

        st.markdown('<div class="section-label">Methods actuales</div>', unsafe_allow_html=True)
        pais_ver = st.selectbox(
            "Ver methods de:",
            list(paises.keys()),
            format_func=lambda x: x.capitalize(),
            key="ver_methods"
        )
        current_methods = methods_data.get(pais_ver, [])

        if current_methods:
            for m in current_methods:
                st.markdown(f'<span class="tag">{m}</span>', unsafe_allow_html=True)
        else:
            st.info("Este país no tiene methods configurados.")
