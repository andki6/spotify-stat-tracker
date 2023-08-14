import { createSlice } from "@reduxjs/toolkit";

const spotifyDetailsSlice = createSlice({
  name: "spotifyDetails",
  initialState: null,
  reducers: {
    setSpotifyDetails: (state, action) => {
      return action.payload;
    },
  },
});

export const { setSpotifyDetails } = spotifyDetailsSlice.actions;
export default spotifyDetailsSlice.reducer;
