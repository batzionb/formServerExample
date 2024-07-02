import React from "react";
import ExtendedForm from "./ExtendedForm";
import uiSchema from "./uiSchema.json";
import schema from "./schema.json";
import { JSONSchema7 } from "json-schema";
const App: React.FC = () => {
  // Example schema (can be passed from parent or fetched dynamically)

  const handleSubmit = (formData: any) => {
    console.log("Form submitted:", formData);
  };

  return (
    <ExtendedForm
      schema={schema as JSONSchema7}
      onSubmit={handleSubmit}
      uiSchema={uiSchema}
    />
  );
};

export default App;
