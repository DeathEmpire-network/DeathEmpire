# Guía editorial del Lore en español

Aplicar estos criterios al revisar los libros sin alterar acontecimientos, términos de canon, voz narrativa ni intención. Si una mejora requiere cambiar significado, detenerse y pedir revisión de canon.

## Lectura

- Mantener una idea, acción o cambio de foco por párrafo. Como referencia, usar de una a tres frases y dividir párrafos muy densos cuando el foco lo permita; no convertir cada frase enfática en un párrafo por sistema.
- En diálogo, abrir un párrafo por intervención y usar raya (—). Reservar las citas en bloque para testimonios, documentos o voces colectivas; separar cada intervención aunque comparta el mismo bloque.
- Usar pausas y frases cortas para enfatizar solo cuando la escena lo pide. Evitar acumulaciones de fragmentos que repiten la misma idea.
- No insertar saltos manuales dentro de una frase para ajustar el ancho visual: el diseño debe resolver el ajuste de línea.

## Ortografía y puntuación

- Seguir la ortografía RAE: tildes, concordancia, régimen verbal y signos de apertura (¿ ¡).
- Preferir comillas angulares (« ») en texto español; reservar comillas curvas (“ ”) para citas anidadas o cuando editarlas afecte una convención del canon.
- Escribir *solo* sin tilde salvo ambigüedad real. Mantener las tildes de términos como *maná*.
- Usar puntos suspensivos como signo único (…) y mayúscula solo cuando comience una oración nueva.
- Corregir gramática y erratas sin reescribir la voz ni modernizar términos propios del mundo.

## Paginación

- Los párrafos son unidades editoriales de `narratives.ts`; cualquier división o unión debe revisarse junto a `pageSizes` en `pagination.ts`.
- Evitar citas al comienzo de una página y párrafos huérfanos. Tras editar, revisar ajuste y desbordamiento en los spreads afectados en escritorio y móvil.
- Mantener el texto seleccionable como HTML y verificar las aperturas con Playwright.
- El cuerpo del libro usa 18 px en lectura. Si un párrafo rebasa la hoja, redistribuir párrafos completos antes de bajar tamaño o interlineado.
- Mantener los conteos como función de `pageSizes`: una apertura son dos páginas físicas; cada capítulo incluye portada, páginas narrativas y cierre editorial.

## Índice del Archivo

- Presentar cada tomo como una doble página horizontal: ficha del tomo a la izquierda e índice de capítulos a la derecha.
- Los tomos ocupan una estantería horizontal; no agregar temporadas futuras como contenido ficticio. En pantallas estrechas, apilar las dos páginas y permitir la lectura sin scroll horizontal.
- Mostrar por tomo capítulos, aperturas y páginas físicas calculadas desde `totalSpreadsFor`; por capítulo, mostrar el conteo derivado del mismo paginador. No mantener esos totales a mano.
- Mantener entradas compactas para que explorar capítulos no convierta el índice en una lista vertical de tarjetas.
- Implementación compartida ES/EN: `src/components/LoreArchive.astro`.
