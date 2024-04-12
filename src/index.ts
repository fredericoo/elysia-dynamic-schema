import { Elysia, error, t } from "elysia";
import {Value} from "@sinclair/typebox/value";


const schemas: Record<string, string> = {
  'with-name': JSON.stringify(t.Object({ name: t.String() }))
}

const app = new Elysia()
  .get("/", () => schemas)
  .post("/schema/:id", ({body, params}) => {
    const {schema } = body;
    schemas[params.id] = schema;
  }, {body: t.Object({
    schema: t.String()
  })})
  .post("/validate/:schema", async ({params, body}) => {
    const schemaString = schemas[params.schema];
    if (!schemaString) return error(404, `Schema ${params.schema} not found`);

    const schemaObj = JSON.parse(schemaString);
    console.log(schemaObj);

    try {
      // Here we’d decode the schema, but as a JSON schema object it won}t work direclty with typebox.
      return Value.Decode(schemaObj,body) ;
    } catch (e) {
      console.error(e)
      return {ok: false}
    }
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
