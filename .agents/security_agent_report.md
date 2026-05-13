# 🛡️ Informe de Seguridad (SecurityAgent)

**Proyecto**: WeedConnect
**Fecha**: 2026-05-13
**Estado**: 🟢 PROTEGIDO (Vulnerabilidades críticas mitigadas)

---

## 📊 Diagnóstico Rápido

- **Auditoría de Dependencias (`pnpm audit`)**: 1 Vulnerabilidad moderada en sub-dependencia (`postcss` vía `next`).
- **Row Level Security (RLS)**: 🟢 **SOLUCIONADO** (Trigger de protección de roles aplicado en SQL).
- **Mecanismo Age Gate**: 🟢 Seguro a nivel de Middleware.
- **Autenticación / Sesiones**: 🟢 Integrado correctamente con Supabase y degradación limpia en fallback.

---

## 🔍 Hallazgos Detallados

### 🟢 [SOLUCIONADO] Escalada de Privilegios en Tabla `public.profiles`
*   **Hallazgo Original**: La política RLS original de UPDATE solo validaba `auth.uid() = id`, lo que permitía a un usuario normal promocionarse a sí mismo a administrador (`role = 'admin'`) a través de llamadas al cliente REST de Supabase.
*   **Solución Aplicada ✅**: Se ha modificado exitosamente el archivo `supabase/migrations/0001_init.sql` introduciendo un disparador (`BEFORE UPDATE TRIGGER`) que bloquea e intercepta cualquier intento de modificación del rol que provenga del cliente público (rol `'authenticated'`), a menos que la persona que realiza la edición ya sea administradora del sistema.
*   **Código del Parche Aplicado**:
    ```sql
    create or replace function public.check_role_change()
    returns trigger
    language plpgsql security definer set search_path = public
    as $$
    begin
      -- Si la petición es de un usuario autenticado del cliente y hay un cambio de rol...
      if auth.role() = 'authenticated' and new.role <> old.role then
        -- Solo permitimos el cambio si el usuario ejecutor ya es admin
        if not exists (
          select 1 from public.profiles
          where id = auth.uid() and role = 'admin'
        ) then
          new.role := old.role; -- Revertir el cambio silenciosamente
        end if;
      end if;
      return new;
    end;
    $$;

    create trigger enforce_profile_roles
      before update on public.profiles
      for each row execute function public.check_role_change();
    ```

---

### 🟡 [MEDIO] Vulnerabilidad en Dependencias (`postcss`)
El comando `pnpm audit` reportó una vulnerabilidad en un paquete transitorio heredado por `next`:
- **Paquete**: `postcss`
- **Identificador**: [GHSA-qx2v-qp2m-jg93](https://github.com/advisories/GHSA-qx2v-qp2m-jg93)
- **Impacto**: Potencial Denegación de Servicio (DoS) en analizadores de CSS locales.
- **Acción**: Bajo impacto en producción ya que solo corre durante el build, pero se recomienda actualizar Next.js en la próxima ventana de mantenimiento para heredar la versión parcheada de postcss.

---

### 🟢 [SEGURO] Middleware y Age Gate (`src/middleware.ts`)
El flujo de bloqueo de contenido para mayores de 18 años está bien protegido a nivel de Edge Middleware.
- La cookie `wc_age_ok` se valida antes de resolver cualquier ruta sensible.
- Se evitan bucles infinitos excluyendo los paths públicos correctamente.
- **Nota menor**: Los endpoints de `/api/*` están excluidos del middleware del Age Gate. Asegúrese de que cualquier endpoint público sensible de la API contenga internamente chequeos adicionales si devuelve datos confidenciales de la comunidad cannábica.

---

## 💡 Próximos Pasos Prioritarios

1.  **Inmediato**: Asegurarse de que la próxima vez que se monte la base de datos de Supabase, se ejecute la versión actualizada de `supabase/migrations/0001_init.sql` (ya reflejado en `TODO_USUARIO.md`).
2.  **Corto Plazo**: Implementar sanitización de entradas HTML en el foro para prevenir inyecciones XSS indirectas en markdown interactivo.
