---
"@atom-uikit/animations": patch
---

text-reveal: los titulares sobre la linea de flotacion ya pueden animarse sin
parpadeo.

`initTextReveal` corre en `load` porque GSAP y SplitText llegan diferidos. Para
un titular que el lector ya tiene delante eso significaba verlo pintado,
desaparecer y volver a entrar — se lee como un fallo, no como una intro. Debajo
del pliegue no se nota, y por eso hasta ahora bastaba con esconder desde JS.

Ahora la pagina puede esconder antes del primer pintado con la clase
`atom-split-pending` en el elemento raiz, y el modulo la retira **en todas sus
salidas**: sin gsap, sin scope, sin titulares, sin titulares elegibles, al
terminar de dividir y en el cleanup. Una pagina que la ponga nunca se queda con
el texto invisible por culpa de este modulo.

La red de seguridad restante es de la pagina: el snippet documentado en el
modulo acompana la clase con un `setTimeout` que la quita a los 2s, para el caso
en que el bundle no llegue a cargar.
