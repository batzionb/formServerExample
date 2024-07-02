import React, { useState } from "react";
import Form, { IChangeEvent } from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { ErrorSchema, UiSchema } from "@rjsf/utils";
import { JSONSchema7 } from "json-schema";
import { ExtendedFormContext } from "./types";
import { JSONPath } from "jsonpath-plus";
import DynamicDropdown from "./DynamicDropdown";

interface ExtendedFormProps {
  schema: JSONSchema7;
  uiSchema: UiSchema;
}

const ExtendedForm: React.FC<ExtendedFormProps> = ({ schema, uiSchema }) => {
  const [formData, setFormData] = useState<object>({});
  const [formContext, setFormContext] = useState<ExtendedFormContext>({
    loadingOptions: true,
    options: {},
  });
  const [extraErrors, setExtraErrors] = React.useState<ErrorSchema>({});

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

  const findId = (id: string, idSchema: { [key: string]: { $id: string } }) => {
    for (const [key, value] of Object.entries(idSchema)) {
      if (value.$id === id) {
        return key;
      }
    }
    return null;
  };

  const fetchValidateResult = async (
    formData_: object,
    fieldName: string,
    fieldValue: string
  ): Promise<string | null> => {
    const url = uiSchema[fieldName]?.["validate:options"]?.url;
    const jsonPath = uiSchema[fieldName]?.["validate:options"]?.jsonPath;
    if (!url || !jsonPath) {
      return null;
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          value: fieldValue,
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
      const data = await response.json();
      const result = JSONPath({ path: jsonPath, json: data, wrap: false });
      if (result !== null && typeof result !== "string") {
        console.error("result type is not string, it's ", result);
        return null;
      }
      return result as string;
    } catch (error) {
      console.error(`Error fetching options for ${url}:`, error);
      return null;
    }
  };

  const extraValidate = async (newFormData: object) => {
    const extraErrors_: ErrorSchema<Record<string, object>> = {};
    for (const [key, value] of Object.entries(newFormData)) {
      const error = await fetchValidateResult(newFormData, key, value);
      const key_ = key as string;
      if (error !== null) {
        extraErrors_[key_] = {
          __errors: [error],
        };
      }
    }
    console.log("extraErrors", extraErrors_);
    setExtraErrors(extraErrors_);
  };

  const handleFormChange = async (e: IChangeEvent, id?: string) => {
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
    extraValidate(newFormData);
    setFormData(newFormData);
  };

  const fetchOptions = async (
    fieldName: string,
    formData_: any
  ): Promise<string[] | null> => {
    const url = uiSchema[fieldName]?.["ui:options"]?.url;
    const jsonPath = uiSchema[fieldName]?.["ui:options"]?.jsonPath;
    if (!url || !jsonPath) {
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
      const result = JSONPath({ path: jsonPath, json: data, wrap: false });
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
    <Form<object, JSONSchema7, ExtendedFormContext>
      schema={schema}
      uiSchema={uiSchema}
      formData={formData}
      onChange={handleFormChange}
      onSubmit={({ errors }) => {
        if (errors.length) {
          alert("Please fix errors");
        } else {
          alert("Form submitted successfully");
        }
      }}
      validator={validator}
      formContext={formContext}
      widgets={{ DynamicDropdown: DynamicDropdown }}
      extraErrors={extraErrors}
      extraErrorsBlockSubmit={true}
      showErrorList={false}
    />
  );
};

export default ExtendedForm;
