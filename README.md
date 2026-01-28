# Genex Store - Backend API

API REST para sistema de inventario con roles de Admin y Vendedor.

## Stack Tecnológico

- Node.js + Express
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication
- bcrypt

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
```

Editar `.env` con tus credenciales de PostgreSQL.

3. Configurar base de datos:
```bash
# Generar cliente de Prisma
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate

# Poblar con usuarios iniciales
npm run seed
```

## Usuarios por Defecto

Después de ejecutar `npm run seed`:

- **Vendedor**
  - Email: `vendedor@genex.com`
  - Password: `12345`

- **Admin**
  - Email: `admin@genex.com`
  - Password: `180305`

## Ejecutar

```bash
# Desarrollo (con auto-reload)
npm run dev

# Producción
npm run build
npm start
```

El servidor estará disponible en: `http://localhost:3000`

## Endpoints API

### Autenticación

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@genex.com",
  "password": "180305"
}

Response:
{
  "token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "name": "Admin",
    "email": "admin@genex.com",
    "role": "ADMIN"
  }
}
```

#### Obtener perfil
```http
GET /api/auth/profile
Authorization: Bearer {token}
```

---

### Productos

#### Listar todos los productos
```http
GET /api/products
Authorization: Bearer {token}
```

#### Obtener producto por ID
```http
GET /api/products/:id
Authorization: Bearer {token}
```

#### Crear producto (Solo Admin)
```http
POST /api/products
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Remera Nike",
  "sku": "REM-NIKE-001",
  "description": "Remera deportiva",
  "salePrice": 1200
}
```

#### Actualizar producto (Solo Admin)
```http
PUT /api/products/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Remera Nike Actualizada",
  "salePrice": 1500
}
```

#### Desactivar producto (Solo Admin)
```http
DELETE /api/products/:id
Authorization: Bearer {token}
```

---

### Compras (Solo Admin)

#### Listar todas las compras
```http
GET /api/purchases
Authorization: Bearer {token}
```

#### Registrar compra (suma stock)
```http
POST /api/purchases
Authorization: Bearer {token}
Content-Type: application/json

{
  "productId": "uuid-del-producto",
  "quantity": 100,
  "costPrice": 500,
  "salePrice": 1200,
  "supplier": "Proveedor XYZ",
  "invoiceNumber": "FAC-001",
  "purchaseDate": "2026-01-24"
}
```

---

### Ventas

#### Registrar venta (resta stock)
```http
POST /api/sales
Authorization: Bearer {token}
Content-Type: application/json

{
  "items": [
    {
      "productId": "uuid-del-producto",
      "quantity": 3
    },
    {
      "productId": "uuid-del-otro-producto",
      "quantity": 2
    }
  ]
}
```

#### Mis ventas (Vendedor)
```http
GET /api/sales/my-sales
Authorization: Bearer {token}
```

#### Todas las ventas (Solo Admin)
```http
GET /api/sales
Authorization: Bearer {token}
```

#### Reporte de ventas por fecha (Solo Admin)
```http
GET /api/sales/report?date=2026-01-24
Authorization: Bearer {token}

Response:
{
  "date": "2026-01-24",
  "summary": {
    "totalAmount": 15000,
    "totalSales": 8,
    "totalItems": 45
  },
  "sales": [...]
}
```

---

## Roles y Permisos

### Admin
- Crear, editar y desactivar productos
- Registrar compras (suma stock)
- Ver todas las compras
- Ver todas las ventas
- Generar reportes por fecha

### Vendedor
- Ver productos
- Registrar ventas (resta stock)
- Ver sus propias ventas

---

## Estructura del Proyecto

```
genex-store-back/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── config/
│   │   └── jwt.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── products.controller.ts
│   │   ├── purchases.controller.ts
│   │   └── sales.controller.ts
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   └── role.middleware.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── products.routes.ts
│   │   ├── purchases.routes.ts
│   │   └── sales.routes.ts
│   ├── types/
│   │   └── index.ts
│   └── index.ts
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## Notas Importantes

1. **Seguridad**: Cambiar `JWT_SECRET` en producción
2. **Base de datos**: Asegurarse de tener PostgreSQL instalado y corriendo
3. **Stock**: Las compras suman stock, las ventas restan stock
4. **Auditoría**: Todos los movimientos se registran en `InventoryMovement`
