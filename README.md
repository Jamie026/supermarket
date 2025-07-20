
# 🛒 Supermarket App

Este proyecto es una aplicación web de supermercado con arquitectura dividida en backend, frontend y base de datos. 

## 📁 Estructura del Proyecto

- `/SQL` → Contiene el script `main.sql` para crear la base de datos en MySQL.
- `/backend` → Servidor Node.js con autenticación y API REST.
- `/frontend` → Interfaz de usuario hecha con React.

Repositorio: [https://github.com/Jamie026/supermarket](https://github.com/Jamie026/supermarket)

---

## 🚀 Pasos para Ejecutar el Proyecto

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Jamie026/supermarket
cd supermarket
```

---

### 2. Configurar la Base de Datos

Ejecuta el archivo `main.sql` que se encuentra en la carpeta `SQL` en un servidor MySQL.  
Se puede usar herramientas como **MySQL Workbench**, **DBeaver**, o la **línea de comandos**.

---

### 3. Crear el Archivo `.env`

Dentro de la carpeta `/backend`, crea un archivo llamado `.env` con el siguiente contenido:

```env
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASS=your_database_password
DB_HOST=your_database_host
DB_DIALECT=mysql

JWT_SECRET=your_jwt_secret_key

EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_app_password
```

> ⚠️ El `EMAIL_USER` y `EMAIL_PASS` deben corresponder a una cuenta de correo configurada con **autenticación en dos pasos**.  
> Asegúrate de generar una **contraseña de aplicación** desde tu proveedor de correo (como Gmail) y usarla como `EMAIL_PASS`.

---

### 4. Iniciar el Backend

Abre una terminal, navega a la carpeta `backend` y ejecuta:

```bash
cd backend
npm install
npm run dev
```

---

### 5. Iniciar el Frontend

En otra terminal, navega a la carpeta `frontend` y ejecuta:

```bash
cd frontend
npm install
npm run dev
```

---

## ✅ Requisitos

- Node.js (v18+ recomendado)
- MySQL Server
- Cuenta de correo con autenticación en dos pasos
- Contraseña de aplicación configurada para el envío de correos

---

## 📬 Contacto

Desarrollado por [Jamie Nuñez](mailto:jaime.nunez@utec.edu.pe)
