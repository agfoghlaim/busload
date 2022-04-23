export default function focusListReducer(state, action) {
	switch (action.type) {
		case 'INIT':
			return {
				...state,
			};

		default:
			return { ...state };
	}
}
