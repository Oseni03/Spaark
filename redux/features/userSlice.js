import { defaultUser } from "@/schema/user";
import { createSlice } from "@reduxjs/toolkit";

const initialState = defaultUser;

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser(state, action) {
			console.log("User: ", action.payload);
			state = action.payload;
		},
	},
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
