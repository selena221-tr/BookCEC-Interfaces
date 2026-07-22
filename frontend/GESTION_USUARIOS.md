# Gestión de Usuarios en BookCEC - Documentación

## Archivos creados / modificados

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `src/services/userService.js` | **Creado** | Servicio CRUD completo para colección `usuarios` en Firestore |
| `src/components/ModalEditarUsuario.jsx` | **Creado** | Modal para editar nombre, rol y estado del usuario |
| `src/pages/Dashboard.jsx` | **Modificado** | Agregado sistema de pestañas y sección de Gestión de Usuarios |
| `src/components/Sidebar.jsx` | **Modificado** | Agregado enlace "Usuarios" en el menú lateral |
| `src/styles/app.css` | **Modificado** | Agregados estilos para tabs, tabla de usuarios y modal |

---

## 1. Servicio de Usuarios (`src/services/userService.js`)

### Funciones exportadas

```js
// Escuchar usuarios en tiempo real (onSnapshot)
subscribeToUsuarios(callback) → unsubscribe function

// Obtener todos los usuarios una sola vez
getUsuarios() → Promise<Usuario[]>

// Actualizar nombre, rol o estado de un usuario
updateUsuario(firestoreId, { nombre, rol, estado }) → Promise<void>

// Eliminar un usuario permanentemente
deleteUsuario(firestoreId) → Promise<void>
```

### Modelo de datos (Documento Firestore)

```
Colección: usuarios/{userId}
{
  nombre: string,          // Nombre completo del usuario
  email: string,           // Correo electrónico (único)
  rol: "admin" | "usuario", // Rol asignado
  estado: "activo" | "inactivo", // Estado de la cuenta
  createdAt: string        // Fecha ISO de registro
}
```

---

## 2. Modal para Editar Usuario (`src/components/ModalEditarUsuario.jsx`)

### Props

| Prop | Tipo | Descripción |
|------|------|-------------|
| `usuario` | Object | Usuario seleccionado (con `firestoreId`, `nombre`, `email`, `rol`, `estado`, `createdAt`) |
| `onSave` | Function | Callback `(firestoreId, data) => Promise` para guardar cambios |
| `onDelete` | Function | Callback `(firestoreId) => Promise` para eliminar el usuario |
| `onClose` | Function | Callback para cerrar el modal |

### Campos del formulario

- **Nombre completo** — Input text, editable
- **Correo electrónico** — Solo lectura (mostrado como referencia)
- **Rol** — Select dropdown con opciones `Admin` / `Usuario`
- **Estado** — Select dropdown con opciones `Activo` / `Inactivo`
- **Fecha de registro** — Solo lectura (mostrada como referencia)

### Botones

- **Eliminar** (rojo, izquierda) — Pide confirmación con `window.confirm` antes de eliminar
- **Cancelar** (gris) — Cierra el modal sin guardar
- **Guardar cambios** (verde, primario) — Ejecuta `onSave` con los datos actualizados

---

## 3. Dashboard con Pestañas (`src/pages/Dashboard.jsx`)

### Estructura visual del Dashboard

```
┌─────────────────────────────────────────────────┐
│  [Sidebar]     [Topbar con nombre de usuario]   │
│               ┌──────┬──────┬──────┬──────┐     │
│               │Libros│Ventas│Ingres│Usuar │     │
│               │  KPI │  KPI │  KPI │  KPI │     │
│               └──────┴──────┴──────┴──────┘     │
│  ┌───────────────────────────────────────┐      │
│  │  Gráfico de Ventas por Nivel          │      │
│  └───────────────────────────────────────┘      │
│                                                 │
│  [ 📚 Libros ] [ 👥 Gestión de Usuarios ]  ← TABS│
│  ─────────────────────────────────────────      │
│  (Contenido según tab activa)                   │
└─────────────────────────────────────────────────┘
```

### Pestaña "Libros" (existente, sin cambios)

- Tabla con: Libro, Nivel, Condición, Precio, Estado
- Filtros por nombre, nivel y estado
- Botón "Publicar" para crear libros
- Clic en fila → Modal de edición

### Pestaña "Gestión de Usuarios" (nueva)

- **KPI Cards:** Se agregó una cuarta card "Usuarios Registrados" con gradiente verde oscuro
- **Filtros:** Búsqueda por nombre/correo + filtro por rol (Admin/Usuario)
- **Contador:** Muestra "X de Y usuarios" sobre la tabla
- **Tabla responsive** con columnas:

| Columna | Contenido |
|---------|-----------|
| Nombre | Icono `bi-person-circle` + nombre |
| Correo Electrónico | Email del usuario |
| Rol | Badge verde `Admin` o azul `Usuario` |
| Estado | Badge verde `Activo` o rojo `Inactivo` |
| Registro | Fecha formateada (es-EC) |
| Acciones | Botones de Editar y Eliminar |

### Botones de acción en la tabla

- **Editar** (verde claro) → Abre `ModalEditarUsuario`
- **Eliminar** (rojo claro) → `window.confirm` → Ejecuta `deleteUsuario`

---

## 4. Sidebar actualizado (`src/components/Sidebar.jsx`)

Se agregó el enlace "Usuarios" con icono `bi-people-fill` que apunta a `#tabla-usuarios`:

```
🏠 Inicio
📚 Libros
📊 Reportes
🛒 Ventas
👥 Usuarios   ← NUEVO
🚪 Cerrar Sesión
```

---

## 5. Estilos CSS agregados (`src/styles/app.css`)

### Dashboard Tabs

| Clase | Estilo |
|-------|--------|
| `.dashboard-tabs` | Contenedor flex con borde inferior |
| `.dashboard-tab` | Botón con padding, color gris, borde transparente |
| `.dashboard-tab.active` | Texto verde oscuro `#2b5c3d`, borde inferior `#4a6741` |
| `.dashboard-tab:hover` | Fondo verde claro translúcido |

### Tabla de Usuarios

| Clase | Estilo |
|-------|--------|
| `.user-name-cell` | Flex con icono y nombre alineados |
| `.user-icon` | Icono verde `#4a6741` tamaño 24px |
| `.usuarios-count` | Badge circular con fondo verde claro |
| `.btn-accion-editar` | Botón verde claro → verde sólido en hover |
| `.btn-accion-eliminar` | Botón rojo claro → rojo sólido en hover |

### Modal Editar Usuario

| Clase | Estilo |
|-------|--------|
| `.usuario-avatar-modal` | Icono persona grande (60px) verde |
| `.btn-eliminar-usuario` | Botón rojo con icono basura |
| `.modal-footer-right` | Flex container para botones Cancelar/Guardar |

### Card KPI nueva

| Clase | Gradiente |
|-------|-----------|
| `.card-3` | `linear-gradient(135deg, #2b5c3d, #3e7d57)` |

---

## 6. Reglas de Firestore requeridas

Para que la gestión de usuarios funcione, las reglas de Firestore deben permitir operaciones en la colección `usuarios`:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /libros/{docId} {
      allow read: if true;
      allow create, update, delete: if request.auth != null;
    }

    match /usuarios/{userId} {
      allow read: if true;
      allow update: if request.auth != null;
      allow delete: if request.auth != null;
    }
  }
}
```

---

## 7. Flujo de datos

```
Firestore (colección: usuarios)
    │
    ├── subscribeToUsuarios()  ← onSnapshot en tiempo real
    │       │
    │       ▼
    │   Dashboard.jsx (state: usuarios)
    │       │
    │       ├── Tab "Gestión de Usuarios"
    │       │       │
    │       │       ├── Tabla con filtros
    │       │       ├── Botón Editar → ModalEditarUsuario
    │       │       └── Botón Eliminar → window.confirm → deleteUsuario()
    │       │
    │       └── KPI Card "Usuarios Registrados"
    │
    └── updateUsuario() / deleteUsuario()  ← Escritura directa a Firestore
```

---

## 8. Build verificado

```
✓ 68 modules transformed
✓ built in 1.51s
dist/index.html              0.45 kB
dist/assets/index-*.css    245.84 kB (gzip: 34.47 kB)
dist/assets/index-*.js     849.35 kB (gzip: 253.41 kB)
```

**Sin errores de compilación.** Solo warning esperado por tamaño del bundle de Firebase.
