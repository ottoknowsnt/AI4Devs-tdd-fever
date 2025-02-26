# Plugin utilizado

Copilot con Claude 3.7 Sonnet Thinking

# Prompt utilizado

Inicialmente se utilizó un prompt dando contexto y un rol determinado a Copilot, pero utilizando el comando `/tests` de Copilot se obtenían mejores resultados, por lo que se optó por utilizarlo, usando como referencia los archivos vinculados con el test a generar, y proporcionando una serie de requisitos para los tests.

Los tests se separaron en archivos distintos para no generar conflictos.

```
@workspace /tests

- Los tests no solo deben cubrir el happy path, sino también cualquier edge case que pueda ocurrir.
- Proporciona además una lista de los escenarios considerados en los tests.
```
