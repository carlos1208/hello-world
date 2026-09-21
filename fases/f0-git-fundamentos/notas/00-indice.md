# Módulo 1 — capa profesional de Git

## Cómo está escrito esto

Cada nota va **por capas**, de lo concreto a lo técnico. No hace falta llegar
al final de una para que sirva:

| Capa | Qué es | Para qué te alcanza |
|---|---|---|
| **1 · Empieza aquí** | el problema en tu mundo y la idea en una frase | entender de qué se trata |
| **2 · Cómo funciona** | el mecanismo, sin jerga | poder explicárselo a alguien |
| **3 · Hazlo** | los comandos mínimos y qué vas a ver | usarlo hoy |
| **4 · El vocabulario** | los términos reales, atados a lo ya visto | leer documentación y entender a otros |
| **5 · Nivel profesional** | internals, trampas, casos límite | sostener una entrevista técnica |
| **✓ Comprobación** | preguntas sin buscar | saber si puedes construir encima |

**Puedes parar donde quieras y volver mañana.** Si una pregunta de la
comprobación falla, al lado dice a qué capa volver — no «relee todo».

No hay que ser desarrollador para ninguna de las cinco. Lo que haga falta saber
—qué es un script, qué es un código de salida— está explicado donde aparece.

## Orden de lectura

1. [Cómo guarda Git tu trabajo](01-modelo-de-objetos.md) — la cámara, el número
   de serie y la cadena. Es la base de las otras tres: sin esto, lo demás se
   memoriza en vez de entenderse.
2. [`reflog`](02-reflog.md) — recuperar lo que creías perdido. Va antes de
   rebase a propósito: es la red debajo del trapecio.
3. [Rebase interactivo](03-rebase-interactivo.md) — ordenar el historial antes
   de entregarlo, para que se pueda diagnosticar después.
4. [`git bisect`](04-bisect.md) — encontrar el commit culpable en 8 pasos en
   lugar de 200.

## Después de leer

- **[Plataforma interactiva](https://claude.ai/artifact/VB9pErnVpXhX4x8B9Brb4z)** —
  las mismas cuatro capas, pero practicando: explorador de objetos, terminal de
  reflog, editor de rebase y simulador de bisect.
- **[Laboratorio](../labs/lab-bisect/)** — un repositorio real con un defecto
  sembrado.
- **[Entregable](../entregable/traza-bisect.md)** — la traza del bisect.
