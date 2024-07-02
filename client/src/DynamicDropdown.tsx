import { WidgetProps } from "@rjsf/utils";
import { JSONSchema7 } from "json-schema";
import { ExtendedFormContext } from "./types";

const DynamicDropdownWidget = ({
  value,
  onChange,
  name,
  formContext,
}: WidgetProps<object, JSONSchema7, ExtendedFormContext>) => {
  if (!formContext) {
    return null;
  }

  return (
    <div style={{ width: "100%" }}>
      <select
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        disabled={formContext.loadingOptions || !formContext.options[name]}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      >
        {formContext.loadingOptions || !formContext.options[name] ? (
          <option value="" disabled>
            Loading...
          </option>
        ) : (
          [...formContext.options[name], ""].map(
            (option: any, index: number) => (
              <option key={index} value={option}>
                {option}
              </option>
            )
          )
        )}
      </select>
    </div>
  );
};

export default DynamicDropdownWidget;
