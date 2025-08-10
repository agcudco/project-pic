## Fundamentación del cambio de roles como objetos

El error inicial (`roles.map is not a function`) surgió porque la estructura de los datos de roles no era consistente y, en ocasiones, no se recibía un array adecuado o se esperaba un string en vez de un objeto. Esto generaba fallos al intentar usar métodos de string sobre un objeto o sobre un valor indefinido.

**¿Por qué cambiar a objetos en vez de strings?**

- Permite acceder a más información de cada rol (id, nombre, descripción, etc.), no solo al nombre.
- Facilita la escalabilidad y futuras ampliaciones, ya que se pueden agregar más propiedades a cada rol sin romper la estructura.
- Evita errores de tipo y ambigüedad, asegurando que siempre se reciba un array de objetos bien definido.
- Mejora la integración y coherencia entre backend y frontend, ya que ambos trabajan con la misma estructura de datos.

En resumen, manejar los roles como objetos hace que la aplicación sea más robusta, flexible y preparada para crecer o adaptarse a nuevas necesidades.
# Cambios realizados y explicación de conflicto 

## Modificaciones realizadas



1. **Frontend (AuthContext.tsx):**
  - Se modificó la función `login` para que, al recibir la respuesta del backend, guarde el usuario y los roles como objetos (no como strings) en el estado del contexto.
  - Se eliminó la petición adicional para obtener los roles por separado, ya que ahora se reciben junto con el usuario.

2. **Backend (loginController.js):**
  - Se modificó la función de login para que retorne un objeto con dos propiedades: `usuario` (datos del usuario autenticado) y `roles` (array de objetos con los roles asociados a ese usuario).

3. **Backend (rolController.js):**
  - Se agregó una función para obtener los roles de un usuario específico, retornando un array de objetos con la información de cada rol.

**Nota:** En el componente `Roles.tsx` no se realizó ninguna modificación durante este proceso. El error se originó porque el contexto de autenticación cambió la estructura de los roles a objetos, pero el componente seguía esperando strings.

---


## Conflicto presentado

- **Origen:**
  - En el frontend, el contexto de autenticación (`AuthContext.tsx`) comenzó a manejar los roles como un array de objetos, pero el componente `Roles.tsx` seguía tratando cada rol como un string (sin haberse modificado aún).
  - Por eso, se intentaban usar métodos de string (`toLowerCase()`, etc.) sobre un objeto, lo que generaba errores.

- **Síntoma:**
  - Error en consola: `role.toLowerCase is not a function`.
  - El componente de roles no mostraba los roles correctamente y la aplicación fallaba al renderizar.

---


## Solución propuesta y aplicada

- **Sincronizar la estructura de datos en el frontend:**
  - Adaptar el frontend para que utilice las propiedades del objeto rol (por ejemplo, `role.nombre`) en vez de tratar cada rol como un string.
  - Así, el contexto y los componentes trabajan con la misma estructura de datos y se evitan errores de tipo.

- **Ventaja:**
  - Permite mostrar más información de cada rol si se requiere en el futuro (por ejemplo, id, descripción, permisos, etc.).

---

**Resumen:**
- El conflicto fue causado por un cambio en la estructura de los datos de roles en el backend, que no fue reflejado inmediatamente en el frontend. La solución fue adaptar el frontend para trabajar con la nueva estructura de datos.
