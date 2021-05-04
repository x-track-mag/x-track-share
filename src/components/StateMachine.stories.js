// StateMachine.stories.js
import { Box, Button, Switch, FormLabel, FormControl } from "@chakra-ui/react";
import { useEffect } from "react";
import { withStateMachine, useStateMachine } from "./StateMachine.js";

export default {
	title: "State Machine"
};

/**
 * Demonstrate a simple On/Off component with a (finite) state machine
 * @param {StateMachineProps} props
 */
const OnOff = ({ state, actions }) => {
	// const { state, actions } = useStateMachine();
	useEffect(() => {
		console.log("Re-rendering OnOff");
	});
	return (
		<Box>
			<FormControl
				display="flex"
				justifyContent="flex-start"
				alignItems="center"
				height={1}
			>
				<FormLabel>
					{state.label}
					<Switch value={state.checked} />
				</FormLabel>
			</FormControl>

			<br />
			<Button onClick={actions.on} variant="contained" color="secondary">
				ON
			</Button>
			<Button onClick={actions.off} variant="contained" color="default">
				OFF
			</Button>
			<Button onClick={actions.toggle} variant="contained" color="primary">
				TOGGLE
			</Button>
		</Box>
	);
};

OnOff.States = {
	ON: { checked: true, label: "ON" },
	OFF: { checked: false, label: "OFF" }
};

OnOff.StateMachine = {
	id: "interrupteur",
	initialState: OnOff.States.OFF,
	actions: {
		on: () => OnOff.States.ON,
		off: () => OnOff.States.OFF,
		toggle: (state) => (state.checked ? OnOff.States.OFF : OnOff.States.ON)
	}
};

/**
 * A super simple state machine (ON/OFF)
 */
export const InterrupteurStateMachine = withStateMachine(OnOff);
