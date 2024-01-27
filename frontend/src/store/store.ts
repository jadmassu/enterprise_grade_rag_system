import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import promptSlice from "../Slice/promptSlice";


// const Store = configureStore({
//     reducer: {
//         promptStore:promptSlice // store
//     },
//     )};

const Store = configureStore({
    reducer: {
        promptStore: promptSlice // store

    },
});

export type AppDispatch = typeof Store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export type RootState = ReturnType<typeof Store.getState>;

export default Store;
