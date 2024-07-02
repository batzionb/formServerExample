import { CircularProgress, FormControl, MenuItem, Select } from "@mui/material";
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
    <FormControl fullWidth>
      <Select
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        disabled={false}
      >
        {formContext?.loadingOptions || !formContext.options[name] ? (
          <MenuItem value="">
            <CircularProgress size={20} />
          </MenuItem>
        ) : (
          formContext.options[name].map((option: any, index: number) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  );
};

export default DynamicDropdownWidget;
