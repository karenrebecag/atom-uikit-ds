<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Inbox count / quiet status:

```tsx
import { Badge } from '@/components/atoms/Badge';

<Badge variant="neutral" state="enabled">3</Badge>
<Badge variant="success">Live</Badge>
```

## Accesibilidad

- If the badge is the only indicator of state, include text (not color alone): “3 unread”, not a bare red dot without a name.
- Decorative badges next to already-named headings can be `aria-hidden` when they add no new information.

### Correcto

- Badge es un `<span>` — no interactivo, no focusable. Correcto para indicadores visuales
- Combinar con aria-label en el padre si el numero no es autoexplicativo (ej: 'Inbox, 3 mensajes sin leer')
- Truncar a '99+' en lugar de mostrar numeros largos que rompen el layout

### Evitar

- No usar Badge para texto largo — maximo 3-4 caracteres (numeros)
- No depender solo del color para comunicar urgencia — el contexto (posicion, texto adyacente) importa
- No usar Badge como boton — es no interactivo. Para acciones, usar Chip con onClose

## Cuándo no usar

- Interactive filters users click to toggle → `Chip` / `Tag` patterns meant for actions.
- Category metadata chips that are purely labels → `Tag` may fit better than a count-oriented badge.

## Criterio de uso

- Usa Badge para conteos cortos o estados secundarios próximos a un control o label, no para explicar una situación completa.
- Si el número representa elementos no leídos, comunica también su significado: “3 mensajes sin leer”, no sólo “3”.
- Mantén el badge inline y proporcional al contenido; una alerta que necesita lectura, acción o detalle debe usar feedback dedicado.

## Gotchas

- El color y la posición no deben ser la única forma de entender el estado.
- Si el badge es decorativo junto a un título ya nombrado, puedes ocultarlo a tecnologías asistivas para evitar repetición.
- **Nota**: Badge trunca con ellipsis si el texto excede max-width (36px). Para conteos grandes, formatea como '99+' desde el componente padre.
- **Nota**: CSS autocontenido. Badge no tiene hover, transiciones ni animaciones — es un indicador estatico puro.
