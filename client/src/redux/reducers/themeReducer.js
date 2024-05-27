import {createSlice} from '@reduxjs/toolkit'


const initialState={
    theme:'light'
};

const themeSlice=createSlice({
    name:"theme",
    initialState,
    reducers:{
        toggleTheme:(state,action)=>{
            state.theme=state.theme==='light'?'dark':'light';
        }
    }
})

export const themeReducer=themeSlice.reducer;
export const themeSelector=(state)=>state.themeReducer;
export const themeActions=themeSlice.actions;
