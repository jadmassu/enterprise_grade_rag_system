import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../utils/api";

export class Prompt {
    id: number = 0;
    name: string = "";
    shortName: string = "";
    description: string = "";
}
export class SearchParams {
    first = 0;
    rows = 7;
    searchText = "";
    sortColumn = "";
    sortDirection: number | null | undefined = 1;
}
interface ResStatus {
    status: number;
    msg: string;
}
interface State {
    prompts: Prompt[];
    prompt: Prompt;
    searchParams: SearchParams;
    resStatus: ResStatus;
    loading: boolean;
}

const initialState: State = {
    prompts: [],
    prompt: {
        id: 0,
        name: "",
        shortName: "",
        description: "",
    },
    searchParams: {
        first: 0,
        rows: 7,
        searchText: "",
        sortColumn: "",
        sortDirection: 1,
    },
    resStatus: {
        status: -1,
        msg: "",
    },
    loading: false,
};
const PromptSlice = createSlice({
    name: "prompt",
    initialState,
    reducers: {
        getPrompts: (
            state: State,
            action: PayloadAction<Prompt[]>
        ) => {
            state.prompts = action.payload;
        },
        addPrompt: (state: State, action: PayloadAction<Prompt>) => {
            state.prompt = action.payload;
        },
        setPrompt: (state: State, action: PayloadAction<Prompt>) => {
            state.prompt = action.payload;
        },
        addResStatus: (state: State, action: PayloadAction<ResStatus>) => {
            state.resStatus = action.payload;

        },
        setSearchParams: (state: State, action: PayloadAction<SearchParams>) => {
            state.searchParams = action.payload;
        },
        setLoading: (state: State, action: PayloadAction<boolean>) => {
            state.loading = action.payload;

        },
    },
});
export const {
    getPrompts,
    addPrompt,
    setLoading,
    addResStatus,
    setSearchParams,
    setPrompt,
} = PromptSlice.actions;
export default PromptSlice.reducer;

const setResStatus = (resStatus: ResStatus) => async (dispatch: any) => {
    dispatch(addResStatus(resStatus));
    setTimeout(() => {
        dispatch(addResStatus({ status: -1, msg: "" }));
    }, 1000);
};

export const fetchPrompts =
    (searchParams: SearchParams): any =>
        async (dispatch: any) => {
            try {
                dispatch(setLoading(true));
                const { first, rows, searchText, sortColumn, sortDirection } =
                    searchParams;
                const response = await api.get(
                    `/prompts?f=${first}&r=${rows}&st=${searchText}&sc=${sortColumn}&sd=${sortDirection}&`
                );
                let feedData = response.data;
                dispatch(getPrompts(feedData));
                dispatch(setLoading(false));
            } catch (error: any) {
                dispatch(setLoading(false));
                dispatch(
                    setResStatus({
                        status: error.response.status,
                        msg: error.response.data.msg,
                    })
                );
            }
        };

export const createPrompt =
    (prompt: Prompt, searchParams: SearchParams): any =>
        async (dispatch: any) => {
            try {
                dispatch(setLoading(true));
                const response = await api.post("/prompts", prompt);
                dispatch(
                    setResStatus({
                        status: response.status,
                        msg: "Prompt created successfully",
                    })
                );
                dispatch(fetchPrompts(searchParams));
                dispatch(setLoading(false));
                dispatch(addPrompt(response.data));
            } catch (error: any) {
                dispatch(setLoading(false));
                dispatch(
                    setResStatus({
                        status: error.response.status,
                        msg: error.response.data.msg,
                    })
                );
            }
        };

export const updatePrompt =
    (prompt: Prompt, searchParams: SearchParams): any =>
        async (dispatch: any) => {
            try {
                dispatch(setLoading(true));
                const response = await api.put(
                    `/prompts/${prompt.id}`,
                    prompt,

                );
                dispatch(fetchPrompts(searchParams));
                dispatch(setLoading(false));
                dispatch(
                    setResStatus({
                        status: response.status,
                        msg: "Prompt updated sucessfuly",
                    })
                );
            } catch (error: any) {
                dispatch(setLoading(false));
                dispatch(
                    setResStatus({
                        status: error.response.status,
                        msg: error.response.data.msg,
                    })
                );
            }
        };

export const deletePrompt =
    (prompt: Prompt): any =>
        async (dispatch: any) => {
            try {
                dispatch(setLoading(true));
                const response = await api.delete(`/prompts/${prompt.id}`,);
                dispatch(setLoading(false));
                dispatch(
                    setResStatus({
                        status: response.status,
                        msg: "Prompt deleted successfully",
                    })
                );
                dispatch(fetchPrompts(new SearchParams()));
            } catch (error: any) {
                dispatch(setLoading(false));
                dispatch(
                    setResStatus({
                        status: error.response.status,
                        msg: error.response.data.msg,
                    })
                );
            }
        };
