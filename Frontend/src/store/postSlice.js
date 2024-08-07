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
                const data = await res.json()
                throw new Error(data.message)
            } else {
                const data = await res.json()
                return data
            }
        } catch (err) {
            throw err
        }
    }
)

export const getPosts = createAsyncThunk(
    'post/get-posts',
    async () => {
        try {
            const res = await fetch('/api/post/get-posts', {
                method: 'GET',
            })
            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.message)
            } else {
                const data = await res.json()
                return data
            }
        } catch (error) {
            throw error.message
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
            state.status = 'fulfilled'
            state.post.unshift(action.payload)
            state.error = null
        })
        .addCase(createPost.rejected, (state, action) => {
            state.status = 'error'
            state.error = action.error.message
        }),
        builder
        .addCase(getPosts.pending, (state) => {
            state.status = 'loading'
        })
        .addCase(getPosts.fulfilled, (state, action) => {
            state.status = 'fulfilled'
            state.post = action.payload
            state.error = null
        })
        .addCase(getPosts.rejected, (state, action) => {
            state.status = 'error'
            state.error = action.error.message
        })

    }
})

export default postSlice.reducer