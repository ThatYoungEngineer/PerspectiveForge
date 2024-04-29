import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
    currentUser : null,
    status: 'idle',
    error : null,
}

export const signInUser = createAsyncThunk(
    'users/login',
    async (userData) => {
      try {
        const res = await fetch('/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
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
  );

 export const signUpUser = createAsyncThunk(
    'users/signup',
    async (userData) => {
      try {
        const res = await fetch('/api/users/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
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
);

export const oAuth = createAsyncThunk(
    'users/google_auth',
    async (userData) => {
        try {
            const res = await fetch('/api/users/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message);
            } else {
                return await res.json();
            }
        } catch (err) {
            console.log('hello', err)
            throw new Error(err.message)
        }
    }
) 

const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers : {
        signOut : (state) => {
            state.currentUser = null
        }
    },
    extraReducers: (builder) => {
        builder
       .addCase(signInUser.pending, (state) => {
            state.status = 'loading'
       })
       .addCase(signInUser.fulfilled, (state, action) => {
            state.status = 'idle'
            state.currentUser = action.payload
            state.error = null
        })
        .addCase(signInUser.rejected, (state, action) => {
            state.status = 'error'
            state.error = action.error.message
        }),
        builder
        .addCase(signUpUser.pending, (state) => {
            state.status = 'loading'
        })
        .addCase(signUpUser.fulfilled, (state, action) => {
            state.status = 'idle'
            state.currentUser = action.payload
            state.error = null
        })
        .addCase(signUpUser.rejected, (state, action) => {
            state.status = 'error'
            state.error = action.error.message
        }),
        builder
        .addCase(oAuth.pending, (state) => {
            state.status = 'loading'
        })
        .addCase(oAuth.fulfilled, (state, action) => {
            state.status = 'idle'
            state.currentUser = action.payload
            state.error = null
        })
        .addCase(oAuth.rejected, (state, action) => {
            state.status = 'error'
            state.error = action.error.message
        })
    }
})

export const {signOut} = userSlice.actions
export default userSlice.reducer