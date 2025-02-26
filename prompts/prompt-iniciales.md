# Plugin utilizado

Copilot con Claude 3.7 Sonnet Thinking

# Prompt utilizado

Inicialmente se utilizó un prompt dando contexto y un rol determinado a Copilot:

```
Eres un desarrollador frontend senior que está trabajando en LTI, una aplicación que quiere convertirse en el ATS (Applicant-Tracking System) del futuro.

La aplicación tiene un frontend en React y un backend en Express usando Prisma como un ORM. El frontend se inicia con Create React App y el backend está escrito en TypeScript.

Ya has desarrollado la funcionalidad básica de la aplicación, permitiendo añadir candidatos a través de un formulario. Ahora es necesario añadir los tests unitarios para probar dicha funcionalidad, en la carpeta `backend/src/tests`. Gracias a tu experiencia, podrás completar tu tarea sin ningún tipo de problema.

- No generes código hasta que se te solicite.
- Los tests no solo deben cubrir el happy path, sino también cualquier edge case que pueda ocurrir.
- Proporciona además una lista de los escenarios considerados en los tests.
- Antes de continuar, confirma que has comprendido la tarea que debes realizar, y en caso contrario realiza las preguntas que consideres necesarias para poder llevar a cabo tu tarea.

Empezaremos añadiendo los tests unitarios del servicio encargado de validar los datos del formulario: `backend/src/application/validator.ts`.

Continuemos añadiendo los tests unitarios del servicio encargado de guardar los datos de los candidatos en la base de datos: `backend/src/application/services/candidateService.ts`.

```

Sin embargo, utilizando el comando `/tests` de Copilot se obtenían mejores resultados, por lo que se optó por utilizarlo, usando como referencia los archivos vinculados con el test a generar, y proporcionando una serie de requisitos para los tests.

Los tests se separaron en archivos distintos para no generar conflictos.

```
@workspace /tests

- Los tests no solo deben cubrir el happy path, sino también cualquier edge case que pueda ocurrir.
- Proporciona además una lista de los escenarios considerados en los tests.
```
