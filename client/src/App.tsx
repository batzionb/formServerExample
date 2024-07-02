import { JSONSchema7 } from "json-schema";
import React from "react";
import ExtendedForm from "./ExtendedForm";
import { UiSchema } from "@rjsf/utils";

const App: React.FC = () => {
  // Example schema (can be passed from parent or fetched dynamically)
  const schema: JSONSchema7 = {
    type: "object",
    properties: {
      country: {
        type: "string",
        title: "Country",
      },
      city: {
        type: "string",
        title: "City",
      },
      username: {
        type: "string",
        title: "User name",
      },
    },
    required: ["country", "city", "username"],
  };

  const uiSchema: UiSchema = {
    country: {
      "ui:widget": "CustomSelectWidget",
      "ui:options": {
        url: "http://localhost:4000/countries",
        jqExpression: "$.countries[*].name",
        dependencies: ["city"],
      },
    },
    city: {
      "ui:widget": "CustomSelectWidget",
      "ui:options": {
        url: "http://localhost:4000/cities",
        jqExpression: "$.cities[*]",
      },
    },
  };
  const handleSubmit = (formData: any) => {
    console.log("Form submitted:", formData);
  };

  return (
    <ExtendedForm schema={schema} onSubmit={handleSubmit} uiSchema={uiSchema} />
  );
};

export default App;
