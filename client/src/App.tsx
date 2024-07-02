import React from "react";
import ExtendedForm from "./ExtendedForm";
import uiSchema from "./uiSchema.json";
import schema from "./schema.json";
import { JSONSchema7 } from "json-schema";
const App: React.FC = () => {
  return <ExtendedForm schema={schema as JSONSchema7} uiSchema={uiSchema} />;
};

export default App;
