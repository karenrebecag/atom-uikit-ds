<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Volume-style range:

```tsx
import { Slider } from '@/components/atoms/Slider';
import { Field } from '@/components/atoms/Field';

<Field label="Volume">
  <Slider min={0} max={100} step={5} value={volume} onValueChange={setVolume} />
</Field>
```

## Accesibilidad

- Expose the live value in nearby text or `aria-valuetext` when the unit is not obvious (% vs currency).
- Keep `min` / `max` / `step` consistent with the visible unit; keyboard must still move the thumb.

### Correcto

- role='slider' en cada thumb con aria-valuemin, aria-valuemax, aria-valuenow
- `tabIndex={0}` permite foco por teclado en los thumbs
- `tabIndex={-1}` cuando disabled — remueve del tab order
- aria-disabled en el thumb cuando disabled
- RangeSlider: cada thumb es focusable independientemente
- Drag previene text selection (userSelect='none' en body durante drag)

### Evitar

- No usar Slider sin label visible — combinar con Field o un `<label>` externo
- No usar step demasiado pequeno en rangos grandes — arrow key navigation sera lenta
- No olvidar touch-action: none en el root — sin esto, touch drag mueve la pagina

## Cuándo no usar

- Discrete few options (S/M/L) → `ToggleGroup` or `Select`.
- Free numeric entry with high precision typing → `Input type="number"`.

## Criterio de uso

- Usa Slider para valores continuos o rangos donde explorar el espacio sea más rápido que escribir.
- Define `min`, `max` y `step` con la unidad visible; para porcentajes, dinero o volumen muestra el valor actual junto al track.
- Si el valor necesita precisión exacta, ofrece también un input numérico o usa directamente `Input type="number"`.

## Gotchas

- El teclado debe avanzar en el mismo incremento que el drag; un `step` que no coincide con la unidad mostrada confunde y puede impedir alcanzar el límite.
- En multi-thumb, etiqueta cada thumb y evita que dos controles compartan un valor ambiguo.
- **Ojo**: En vanilla, necesitas JS para calcular left% del thumb y width% del range. El CSS solo define el visual — la posicion es inline style.
- **Ojo**: El CSS solo define el visual. Necesitas JS para: (1) calcular left% del thumb desde el valor, (2) actualizar width% del range, (3) manejar drag (mouse/touch), (4) keyboard navigation. Ver el componente React como referencia de la logica completa.

## Navegacion por teclado

| Tecla | Accion |
| --- | --- |
| Arrow Right / Up | Incrementa value por step |
| Arrow Left / Down | Decrementa value por step |
| Home | Salta al min |
| End | Salta al max |
| Tab | Mueve foco al siguiente thumb (RangeSlider) o siguiente elemento |
