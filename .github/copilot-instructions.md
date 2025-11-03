# 🤖 GitHub Copilot Instructions — Movie Reservation Backend

Este archivo le indica a GitHub Copilot y a los colaboradores cómo deben contribuir con el código de este proyecto NestJS.

---

## 🧠 Contexto del proyecto

Este repositorio contiene el backend de un **sistema de reservas de películas** desarrollado con:

- **Framework:** NestJS  
- **ORM:** Prisma  
- **Base de datos:** PostgreSQL  
- **Lenguaje:** TypeScript  
- **Autenticación:** JWT (con roles USER / ADMIN)  
- **IDs:** UUIDs en todas las entidades  

El sistema permite:
- Registrar e iniciar sesión de usuarios.
- Consultar películas, funciones y asientos.
- Realizar reservas de asientos por función.
- Cancelar reservas activas.
- Gestión de películas, funciones, géneros, y salas (solo admins).
- Reportes de capacidad y revenue (solo admins).

---

## ⚙️ Estructura del proyecto

El proyecto está modularizado por dominio:

src/
├── auth/
├── users/
├── movies/
├── genres/
├── theaters/
├── showtimes/
├── reservations/
├── common/
├── main.ts
└── app.module.ts

Cada módulo debe contener:

📁 module-name/
├── dto/
│ └── create-.dto.ts
│ └── update-.dto.ts
├── entities/
│ └── *.entity.ts
├── *.controller.ts
├── *.service.ts
├── *.module.ts


---

## 🧩 Convenciones de código

- Usa **TypeScript estricto** (`"strict": true` en `tsconfig.json`).
- Todos los IDs son `string` (UUIDs generados por Prisma).
- Los DTOs deben usar **class-validator** y **class-transformer**.
- Los servicios nunca deben lanzar excepciones crudas; usa los **filtros NestJS** (`HttpException`, `NotFoundException`, etc.).
- Usa **transacciones Prisma** para operaciones que afecten varias tablas (por ejemplo, reservas y asientos).
- Las respuestas deben seguir un formato consistente:

```ts
{
  success: boolean;
  message: string;
  data?: any;
}

🧑‍💻 Guías para Copilot
✅ Copilot debe:

Sugerir código basado en buenas prácticas NestJS y Prisma.

Usar decoradores de validación (@IsString(), @IsUUID(), etc.).

Proponer controladores RESTful y DTOs bien definidos.

Recomendar transacciones seguras para reservas.

Sugerir ejemplos de seeds y pruebas unitarias.

Usar inyección de dependencias (DI) con constructor(private service: Service).

🚫 Copilot no debe:

Escribir SQL crudo (usar Prisma siempre).

Sugerir contraseñas o claves estáticas.

Usar any o tipado implícito.

Ignorar el control de roles y autenticación.

Repetir lógica en controladores que debería estar en servicios.

🔐 Autenticación y Roles

Copilot debe implementar los siguientes patrones cuando sugiera código:

AuthGuard('jwt') para rutas protegidas.

Decorador personalizado @Roles('ADMIN') para restringir endpoints.

Guard de roles con Reflector para validar acceso.

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Get()
findAll() {
  return this.moviesService.findAll();
}


🧠 Lógica crítica a proteger

Reservas:

Validar asientos disponibles antes de crear la reserva.

Usar transacción Prisma.

No permitir reservas duplicadas en el mismo horario.

Cancelaciones:

Solo futuras (showtime.startTime > now()).

Cambiar status a CANCELLED.

Reportes:

Solo accesibles para admin.

Calcular ocupación por función, ingresos totales y reservas canceladas.

🧾 Formato de commits

Usa convención semántica (para mantener trazabilidad):

feat: agregar endpoint de creación de reservas
fix: corregir validación de asientos duplicados
chore: actualizar dependencias prisma
refactor: extraer guard de roles a módulo común
docs: agregar guía copilot-instructions.md

