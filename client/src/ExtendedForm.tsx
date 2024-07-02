import React, { useState } from "react";
import Form, { IChangeEvent } from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { UiSchema, WidgetProps } from "@rjsf/utils";
import { JSONSchema7 } from "json-schema";
import CustomSelectWidget from "./CustomSelectWidget";
import { ExtendedFormContext } from "./types";
import { JSONPath } from "jsonpath-plus";

interface ExtendedFormProps {
  schema: JSONSchema7;
  onSubmit: (formData: any) => void;
  uiSchema: UiSchema;
}

const ExtendedForm: React.FC<ExtendedFormProps> = ({
  schema,
  onSubmit,
  uiSchema,
}) => {
  const [formData, setFormData] = useState<object>({});
  const [formContext, setFormContext] = useState<ExtendedFormContext>({
    loadingOptions: true,
    options: {},
  });

  const onChange = async () => {};

  const initialize = async () => {
    const allOptions: ExtendedFormContext["options"] = {};
    for (const fieldName in schema.properties) {
      const options = await fetchOptions(fieldName, formData);
      if (options !== null) {
        allOptions[fieldName] = options;
      }
    }
    setFormContext({
      loadingOptions: false,
      options: allOptions,
    });
  };

  React.useEffect(() => {
    initialize();
  }, []);
  const handleSubmit = ({ formData }: any) => {
    onSubmit(formData);
  };

  const findId = (id: string, idSchema: { [key: string]: { $id: string } }) => {
    for (const [key, value] of Object.entries(idSchema)) {
      if (value.$id === id) {
        return key;
      }
    }
    return null;
  };

  const handleFormChange = async (e: IChangeEvent, id?: string) => {
    console.log(id);
    if (!id) {
      return;
    }
    const name = findId(id, e.idSchema as { [key: string]: { $id: string } });
    if (!name) {
      console.error(`failed to find name for id ${id}`);
      return;
    }
    const newFormData = { ...e.formData };
    setFormContext({
      ...formContext,
      loadingOptions: true,
    });
    const allOptions: ExtendedFormContext["options"] = {
      ...formContext.options,
    };
    const dependencies = uiSchema[name]?.["ui:options"]
      ?.dependencies as string[];
    if (dependencies) {
      for (const dependency of dependencies) {
        newFormData[dependency] = null;
        const options = await fetchOptions(dependency, newFormData);
        if (options !== null) {
          allOptions[dependency] = options;
        }
      }
    }
    setFormContext({
      loadingOptions: false,
      options: allOptions,
    });
    setFormData(newFormData);
  };

  const fetchOptions = async (
    fieldName: string,
    formData_: any
  ): Promise<string[] | null> => {
    const url = uiSchema[fieldName]?.["ui:options"]?.url;
    const jqExpression = uiSchema[fieldName]?.["ui:options"]?.jqExpression;
    if (!url || !jqExpression) {
      return null;
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          formData: formData_,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      if (!response.ok) {
        console.error("Network response was not ok");
        return null;
      }
      const { data } = await response.json();
      const result = JSONPath({ path: jqExpression, json: data });
      if (!Array.isArray(result)) {
        return null;
      }
      return result as string[];
    } catch (error) {
      console.error(`Error fetching options for ${url}:`, error);
      return null;
    }
  };

  return (
    <div>
      <h1>Dynamic Form Example</h1>
      <Form<object, JSONSchema7, ExtendedFormContext>
        schema={schema}
        uiSchema={uiSchema}
        formData={formData}
        onChange={handleFormChange}
        onSubmit={handleSubmit}
        validator={validator}
        formContext={formContext}
        widgets={{ CustomSelectWidget: CustomSelectWidget }}
      />
    </div>
  );
};

export default ExtendedForm;
