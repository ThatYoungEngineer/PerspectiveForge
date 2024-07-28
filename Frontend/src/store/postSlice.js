import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

const initialState = {
    post : [],
    status: 'idle',
    error : null,
}

export const createPost = createAsyncThunk(
    'post/create-new-post',
    async (data) => {
        try {
            const res = await fetch('/api/post/create-new-post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message);
            } else {
                return await res.json();
            }
        } catch (err) {
            throw new Error(err.message)
        }
    }
)

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(createPost.pending, (state) => {
            state.status = 'loading'
        })
        .addCase(createPost.fulfilled, (state, action) => {
            state.status = 'idle'
            state.post.unshift(action.payload)
            state.error = null
        })
        .addCase(createPost.rejected, (state, action) => {
            state.status = 'error'
            state.error = action.error.message
        })

    }
})

export default postSlice.reducer