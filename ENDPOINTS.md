# API Endpoints - Genex Store

## Base URL
```
http://localhost:3000/api
```

---

## 🔐 Autenticación

### 1. Login
**Endpoint:** `POST /api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "admin@genex.com",
  "password": "180305"
}
```

**Respuesta exitosa (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Admin",
    "email": "admin@genex.com",
    "role": "ADMIN"
  }
}
```

**Nota:** Guardar el token para usarlo en todas las demás peticiones.

---

### 2. Obtener Perfil
**Endpoint:** `GET /api/auth/profile`

**Headers:**
```
Authorization: Bearer {tu_token_aqui}
```

**Respuesta exitosa (200):**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "admin@genex.com",
    "role": "ADMIN",
    "name": "Admin"
  }
}
```

---

## 📦 Productos

### 3. Listar Productos
**Endpoint:** `GET /api/products`

**Headers:**
```
Authorization: Bearer {token}
```

**Respuesta exitosa (200):**
```json
[
  {
    "id": "prod-uuid-1",
    "name": "Remera Nike",
    "sku": "REM-NIKE-001",
    "description": "Remera deportiva",
    "currentStock": 50,
    "salePrice": "1200.00",
    "isActive": true,
    "createdAt": "2026-01-24T10:00:00.000Z",
    "updatedAt": "2026-01-24T10:00:00.000Z"
  }
]
```

**Acceso:** Admin y Vendedor

---

### 4. Obtener Producto por ID
**Endpoint:** `GET /api/products/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Ejemplo:** `GET /api/products/prod-uuid-1`

**Respuesta exitosa (200):**
```json
{
  "id": "prod-uuid-1",
  "name": "Remera Nike",
  "sku": "REM-NIKE-001",
  "description": "Remera deportiva",
  "currentStock": 50,
  "salePrice": "1200.00",
  "isActive": true,
  "createdAt": "2026-01-24T10:00:00.000Z",
  "updatedAt": "2026-01-24T10:00:00.000Z"
}
```

**Acceso:** Admin y Vendedor

---

### 5. Crear Producto (Solo Admin)
**Endpoint:** `POST /api/products`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Remera Nike",
  "sku": "REM-NIKE-001",
  "description": "Remera deportiva talle L",
  "salePrice": 1200
}
```

**Respuesta exitosa (201):**
```json
{
  "id": "prod-uuid-1",
  "name": "Remera Nike",
  "sku": "REM-NIKE-001",
  "description": "Remera deportiva talle L",
  "currentStock": 0,
  "salePrice": "1200.00",
  "isActive": true,
  "createdAt": "2026-01-24T10:00:00.000Z",
  "updatedAt": "2026-01-24T10:00:00.000Z"
}
```

**Acceso:** Solo Admin

---

### 6. Actualizar Producto (Solo Admin)
**Endpoint:** `PUT /api/products/:id`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Remera Nike Actualizada",
  "description": "Nueva descripción",
  "salePrice": 1500
}
```

**Respuesta exitosa (200):**
```json
{
  "id": "prod-uuid-1",
  "name": "Remera Nike Actualizada",
  "sku": "REM-NIKE-001",
  "description": "Nueva descripción",
  "currentStock": 50,
  "salePrice": "1500.00",
  "isActive": true,
  "createdAt": "2026-01-24T10:00:00.000Z",
  "updatedAt": "2026-01-24T11:00:00.000Z"
}
```

**Acceso:** Solo Admin

---

### 7. Desactivar Producto (Solo Admin)
**Endpoint:** `DELETE /api/products/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Respuesta exitosa (200):**
```json
{
  "message": "Producto desactivado exitosamente"
}
```

**Acceso:** Solo Admin

---

## 🛒 Compras (Solo Admin)

### 8. Listar Compras
**Endpoint:** `GET /api/purchases`

**Headers:**
```
Authorization: Bearer {token}
```

**Respuesta exitosa (200):**
```json
[
  {
    "id": "purchase-uuid-1",
    "productId": "prod-uuid-1",
    "quantity": 100,
    "costPrice": "500.00",
    "salePrice": "1200.00",
    "totalCost": "50000.00",
    "supplier": "Proveedor ABC",
    "invoiceNumber": "FAC-001",
    "purchaseDate": "2026-01-24T00:00:00.000Z",
    "createdBy": "admin-uuid",
    "createdAt": "2026-01-24T10:00:00.000Z",
    "product": {
      "id": "prod-uuid-1",
      "name": "Remera Nike",
      "sku": "REM-NIKE-001",
      "currentStock": 100
    },
    "user": {
      "name": "Admin",
      "email": "admin@genex.com"
    }
  }
]
```

**Acceso:** Solo Admin

---

### 9. Registrar Compra (Suma Stock)
**Endpoint:** `POST /api/purchases`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "productId": "prod-uuid-1",
  "quantity": 100,
  "costPrice": 500,
  "salePrice": 1200,
  "supplier": "Proveedor ABC",
  "invoiceNumber": "FAC-001",
  "purchaseDate": "2026-01-24"
}
```

**Campos obligatorios:**
- `productId`: UUID del producto
- `quantity`: Cantidad comprada (número entero positivo)
- `costPrice`: Precio de costo por unidad
- `salePrice`: Precio de venta por unidad
- `purchaseDate`: Fecha en formato YYYY-MM-DD

**Campos opcionales:**
- `supplier`: Nombre del proveedor
- `invoiceNumber`: Número de factura

**Respuesta exitosa (201):**
```json
{
  "id": "purchase-uuid-1",
  "productId": "prod-uuid-1",
  "quantity": 100,
  "costPrice": "500.00",
  "salePrice": "1200.00",
  "totalCost": "50000.00",
  "supplier": "Proveedor ABC",
  "invoiceNumber": "FAC-001",
  "purchaseDate": "2026-01-24T00:00:00.000Z",
  "createdBy": "admin-uuid",
  "createdAt": "2026-01-24T10:00:00.000Z",
  "product": {
    "id": "prod-uuid-1",
    "name": "Remera Nike",
    "currentStock": 100
  }
}
```

**Nota:** Al crear una compra, el stock del producto se incrementa automáticamente.

**Acceso:** Solo Admin

---

## 💰 Ventas

### 10. Registrar Venta (Resta Stock)
**Endpoint:** `POST /api/sales`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "items": [
    {
      "productId": "prod-uuid-1",
      "quantity": 3
    },
    {
      "productId": "prod-uuid-2",
      "quantity": 2
    }
  ]
}
```

**Respuesta exitosa (201):**
```json
{
  "id": "sale-uuid-1",
  "totalAmount": "6600.00",
  "sellerId": "vendedor-uuid",
  "sellerName": "Vendedor",
  "saleDate": "2026-01-24T14:30:00.000Z",
  "createdAt": "2026-01-24T14:30:00.000Z",
  "items": [
    {
      "id": "item-uuid-1",
      "saleId": "sale-uuid-1",
      "productId": "prod-uuid-1",
      "productName": "Remera Nike",
      "quantity": 3,
      "unitPrice": "1200.00",
      "subtotal": "3600.00",
      "product": {
        "id": "prod-uuid-1",
        "name": "Remera Nike",
        "currentStock": 97
      }
    },
    {
      "id": "item-uuid-2",
      "saleId": "sale-uuid-1",
      "productId": "prod-uuid-2",
      "productName": "Zapatillas Adidas",
      "quantity": 2,
      "unitPrice": "1500.00",
      "subtotal": "3000.00",
      "product": {
        "id": "prod-uuid-2",
        "name": "Zapatillas Adidas",
        "currentStock": 48
      }
    }
  ]
}
```

**Nota:**
- Al crear una venta, el stock se descuenta automáticamente
- Se valida que haya stock suficiente antes de realizar la venta
- La fecha y hora se registran automáticamente

**Acceso:** Admin y Vendedor

---

### 11. Mis Ventas (Vendedor)
**Endpoint:** `GET /api/sales/my-sales`

**Headers:**
```
Authorization: Bearer {token}
```

**Respuesta exitosa (200):**
```json
[
  {
    "id": "sale-uuid-1",
    "totalAmount": "3600.00",
    "sellerId": "vendedor-uuid",
    "sellerName": "Vendedor",
    "saleDate": "2026-01-24T14:30:00.000Z",
    "createdAt": "2026-01-24T14:30:00.000Z",
    "items": [
      {
        "id": "item-uuid-1",
        "productName": "Remera Nike",
        "quantity": 3,
        "unitPrice": "1200.00",
        "subtotal": "3600.00"
      }
    ]
  }
]
```

**Acceso:** Vendedor (solo ve sus propias ventas)

---

### 12. Todas las Ventas (Solo Admin)
**Endpoint:** `GET /api/sales`

**Headers:**
```
Authorization: Bearer {token}
```

**Respuesta exitosa (200):**
```json
[
  {
    "id": "sale-uuid-1",
    "totalAmount": "3600.00",
    "sellerId": "vendedor-uuid",
    "sellerName": "Vendedor Juan",
    "saleDate": "2026-01-24T14:30:00.000Z",
    "createdAt": "2026-01-24T14:30:00.000Z",
    "items": [...],
    "seller": {
      "name": "Vendedor Juan",
      "email": "vendedor@genex.com"
    }
  },
  {
    "id": "sale-uuid-2",
    "totalAmount": "1500.00",
    "sellerId": "vendedor2-uuid",
    "sellerName": "Vendedor María",
    "saleDate": "2026-01-24T15:00:00.000Z",
    "createdAt": "2026-01-24T15:00:00.000Z",
    "items": [...],
    "seller": {
      "name": "Vendedor María",
      "email": "maria@genex.com"
    }
  }
]
```

**Acceso:** Solo Admin

---

### 13. Reporte de Ventas por Fecha (Solo Admin)
**Endpoint:** `GET /api/sales/report?date=2026-01-24`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `date`: Fecha en formato YYYY-MM-DD (requerido)

**Ejemplo:** `GET /api/sales/report?date=2026-01-24`

**Respuesta exitosa (200):**
```json
{
  "date": "2026-01-24",
  "summary": {
    "totalAmount": 15000,
    "totalSales": 8,
    "totalItems": 45
  },
  "sales": [
    {
      "id": "sale-uuid-1",
      "totalAmount": "3600.00",
      "sellerId": "vendedor-uuid",
      "sellerName": "Vendedor Juan",
      "saleDate": "2026-01-24T09:30:00.000Z",
      "items": [
        {
          "productName": "Remera Nike",
          "quantity": 3,
          "unitPrice": "1200.00",
          "subtotal": "3600.00"
        }
      ],
      "seller": {
        "name": "Vendedor Juan",
        "email": "vendedor@genex.com"
      }
    },
    {
      "id": "sale-uuid-2",
      "totalAmount": "1500.00",
      "sellerId": "vendedor2-uuid",
      "sellerName": "Vendedor María",
      "saleDate": "2026-01-24T10:15:00.000Z",
      "items": [
        {
          "productName": "Zapatillas Adidas",
          "quantity": 1,
          "unitPrice": "1500.00",
          "subtotal": "1500.00"
        }
      ],
      "seller": {
        "name": "Vendedor María",
        "email": "maria@genex.com"
      }
    }
  ]
}
```

**Descripción:**
- `summary.totalAmount`: Total vendido en el día
- `summary.totalSales`: Cantidad de ventas realizadas
- `summary.totalItems`: Total de unidades vendidas
- `sales`: Lista de todas las ventas del día con detalles

**Acceso:** Solo Admin

---

## 🔒 Códigos de Error Comunes

### 400 Bad Request
```json
{
  "error": "Mensaje de error descriptivo"
}
```
Ejemplos:
- Campos requeridos faltantes
- Stock insuficiente
- SKU duplicado

### 401 Unauthorized
```json
{
  "error": "Token no proporcionado"
}
```
o
```json
{
  "error": "Token inválido o expirado"
}
```

### 403 Forbidden
```json
{
  "error": "Acceso denegado. Solo administradores."
}
```

### 404 Not Found
```json
{
  "error": "Producto no encontrado"
}
```

### 500 Internal Server Error
```json
{
  "error": "Error en el servidor"
}
```

---

## 📝 Notas Importantes

1. **Autenticación:** Todas las rutas excepto `/api/auth/login` requieren el header `Authorization: Bearer {token}`

2. **Formato de fechas:** Usar formato ISO 8601: `YYYY-MM-DD` o `YYYY-MM-DDTHH:mm:ss.sssZ`

3. **Decimales:** Los precios se manejan con 2 decimales

4. **Stock:**
   - Las compras SUMAN al stock
   - Las ventas RESTAN del stock
   - El sistema valida que haya stock suficiente antes de vender

5. **Roles:**
   - `ADMIN`: Acceso completo
   - `VENDEDOR`: Solo puede registrar ventas y ver sus propias ventas

---

## 🧪 Usuarios de Prueba

Después de ejecutar `npm run seed`:

```
Admin:
- Email: admin@genex.com
- Password: 180305

Vendedor:
- Email: vendedor@genex.com
- Password: 12345
```
