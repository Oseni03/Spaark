import { defaultUser } from "@/schema/user";
import { createSlice } from "@reduxjs/toolkit";
import { logger } from "@/lib/utils";

const initialState = defaultUser;

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser(state, action) {
			logger.info("redux user data: ", action.payload);
			return {
				...state,
				...action.payload,
			};
		},
	},
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
