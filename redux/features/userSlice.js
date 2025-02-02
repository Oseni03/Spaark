import { defaultUser } from "@/schema/user";
import { createSlice } from "@reduxjs/toolkit";
import { logger } from "@/lib/utils";

const initialState = {
	data: defaultUser,
	loading: false,
	error: null,
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser(state, action) {
			logger.info("redux user data: ", action.payload);
			state.data = {
				...defaultUser,
				...action.payload,
				subscription: action.payload.subscription || null,
			};
		},
		clearUser: (state) => {
			state.data = null;
		},
	},
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
