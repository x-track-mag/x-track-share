import { createRef, useState, useEffect, useLayoutEffect } from "react";
import GroupLabel from "../GroupLabel.js";
import { useFormValidationContext } from "../validation/FormValidationProvider.js";
import { convertOptions } from "./utils.js";
import { SimpleGrid } from "@chakra-ui/layout";
import { Checkbox } from "@chakra-ui/checkbox";
import { CheckboxGroup } from "@chakra-ui/checkbox";

/**
 * @typedef CheckBoxesProps
 * @property {String} name
 * @property {String} label
 * @property {Array|Object} options Available options to choose from (code + label) or map
 */
/**
 * A group of checkboxes used to display an array of possible values
 * @param {CheckBoxesProps} props
 */
const CheckBoxes = ({
	name = "checkbox",
	label = "",
	options = [],
	required = false,
	autoFocus = false,
	defaultValue = [],
	validation = {},
	columns = 3 // checkboxes are arranged in 3 columns
}) => {
	const inputRef = createRef(); // This ref will reference the first checkbox in the serie

	// Find the Form Validation Context to register our input
	const { register, errors, setData, getData, validate } = useFormValidationContext();

	// Register our Input so that the validation can take effect
	register(name, { inputRef, required, defaultValue, validation });

	// Get the current checked values from the ValidationContext
	const [values, setValues] = useState(getData(name));

	// Do we  have an error ?
	const errorMessage = errors[name]?.message || "";

	// Accept a hashmap (key : value) as different format
	if (!Array.isArray(options)) options = convertOptions(options);

	/**
	 * When a single checkbox change : add or remove the value from the list
	 * @param {Event} evt
	 */
	const onChange = (evt) => {
		const valueToToggle = evt.target.value;
		if (values.includes(valueToToggle)) {
			setData(
				name,
				values.filter((val) => val !== valueToToggle)
			);
		} else {
			setData(name, [...values, valueToToggle]);
		}
		setValues(getData(name));
		if (evt.key === "Enter" && !evt.shiftKey) {
			validate();
		}
	};

	useLayoutEffect(() => {
		if (autoFocus) {
			inputRef.current.focus();
		}
	}, [name]);

	return (
		<CheckboxGroup label={label}>
			<SimpleGrid columns={columns}>
				{options.map(({ code, label }, i) => {
					if (i === 0) {
						return (
							<Checkbox
								inputRef={inputRef} // the ref for focus is on the first element
								name={`${name}:${code}`}
								key={`${name}:${code}`}
								value={code}
								checked={values.includes(code)}
								onChange={onChange}
							>
								{label}
							</Checkbox>
						);
					} else {
						return (
							<Checkbox
								name={`${name}:${code}`}
								key={`${name}:${code}`}
								value={code}
								checked={values.includes(code)}
								onChange={onChange}
							>
								{label}
							</Checkbox>
						);
					}
				})}
				{errorMessage && (
					<FormHelperText error={true}>{errorMessage}</FormHelperText>
				)}
			</SimpleGrid>
		</CheckboxGroup>
	);
};

export default CheckBoxes;
