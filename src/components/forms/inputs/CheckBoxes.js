import { createRef, useState } from "react";
import { useFormValidationContext } from "../validation/FormValidationProvider.js";
import { convertOptions } from "./utils.js";
import { SimpleGrid } from "@chakra-ui/layout";
import { Checkbox } from "@chakra-ui/checkbox";
import { CheckboxGroup } from "@chakra-ui/checkbox";
import useIsomorphicLayoutEffect from "../../../hooks/useIsomorphicLayoutEffect.js";

/**
 * @typedef CheckBoxesProps
 * @property {String} name
 * @property {String} label
 * @property {Array|Object} options Available options to choose from (code + label) or map
 * @property {"array"|"object"} [serialization="array"] Choose how to serialize the checked values
 * @property {Array|Object} [defaultValue=[]] The initial checked values (conforming to the serialization choice)
 * @property {Number} [columns=3]
 * @property {Function} [onChange] An optional callback for when things change..
 * @property {Object} validation Validation rules
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
	serialization = "array", // serialize checked options as an "array" or an "object"
	validation = {},
	onChange,
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
	const _onChange = (evt) => {
		const valueToToggle = evt.target.value;
		if (serialization === "array") {
			if (values.includes(valueToToggle)) {
				setData(
					name,
					values.filter((val) => val !== valueToToggle)
				);
			} else {
				setData(name, [...values, valueToToggle]);
			}
		} else {
			setData(`${name}.${valueToToggle}`, !values[valueToToggle]);
		}

		if (evt.key === "Enter") {
			validate();
		}
		if (onChange) {
			onChange();
		}
		// Update the local state
		setValues(getData(name));
	};

	const isChecked =
		serialization === "array" ? (val) => values.includes(val) : (val) => values[val];

	useIsomorphicLayoutEffect(() => {
		if (autoFocus) {
			inputRef.current?.focus();
		}
	}, [name]);

	return (
		<CheckboxGroup label={label}>
			<SimpleGrid columns={columns}>
				{options.map(({ code, label }, i) => {
					if (i === 0) {
						return (
							<Checkbox
								ref={inputRef} // the ref for focus is on the first element
								name={`${name}:${code}`}
								key={`${name}:${code}`}
								value={code}
								checked={isChecked(code)}
								onChange={_onChange}
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
								checked={isChecked(code)}
								onChange={_onChange}
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
