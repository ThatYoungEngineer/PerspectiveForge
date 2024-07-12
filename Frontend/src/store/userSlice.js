import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
    currentUser : null,
    status: 'idle',
    error : null,
}

export const signInUser = createAsyncThunk(
    'user/login',
    async (userData) => {
      try {
        const res = await fetch('/api/user/login', {
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
)

export const signUpUser = createAsyncThunk(
    'user/signup',
    async (userData) => {
      try {
        const res = await fetch('/api/user/signup', {
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
    'user/google_auth',
    async (userData) => {
        try {
            const res = await fetch('/api/user/google', {
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

export const updateUser = createAsyncThunk(
    'user/update',
    async (userData) => {
        try {
            const res = await fetch(`/api/user/update/${userData.id}`, {
                method: 'PUT',
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
            throw new Error('Network error. Please try again')
        }
    }
)

export const signOut = createAsyncThunk(
    'user/signOut',
    async () => {
        try {
            const res = await fetch('/api/user/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message);
            } else {
                return await res.json();
            }
        }   catch (err) {
            throw new Error(err.message)
        }
    }
)

export const deleteUser = createAsyncThunk (
    'user/delete/userId',
    async (userId) => {
        try {
            const res = await fetch(`/api/user/delete/${userId}`, {
                method: 'DELETE',
                body: JSON.stringify(userId)
            })
            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.message)
            } else {
                const response = await res.json()
                console.log("Deleted user respnse: ", response)
            }
        } catch (error) { throw new Error(error.message) }
    }
)

export const checkUserAuth = createAsyncThunk(
    'user/checkUserAuth',
    async (_, { dispatch }) => {
      try {
        const response = await fetch('/api/user/checkUserAuth', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (response.status !== 200) {
            await dispatch(signOut())
        }
      } catch (error) {
        console.log(error)
      }
    }
)

const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers : {},
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
        }),
        builder
        .addCase(updateUser.pending, (state) => {
            state.status = 'loading'
        })
        .addCase(updateUser.fulfilled, (state, action) => {
            state.status = 'idle'
            state.currentUser = action.payload
            state.error = null
        })
        .addCase(updateUser.rejected, (state, action) => {
            state.status = 'error'
            state.error = action.error.message
        }),
        builder
        .addCase(signOut.pending, (state) => {
            state.status = 'loading'
        })
        .addCase(signOut.fulfilled, (state, action) => {
            state.status = 'idle'
            state.currentUser = null
            state.error = null
        })
        .addCase(signOut.rejected, (state, action) => {
            state.status = 'error'
            state.error = action.error.message
        })
        builder
        .addCase(deleteUser.pending, (state) => {
            state.status = 'loading'
        })
        .addCase(deleteUser.fulfilled, (state, action) => {
            state.status = 'idle'
            state.currentUser = null
            state.error = null
        })
        .addCase(deleteUser.rejected, (state, action) => {
            state.status = 'error'
            state.error = action.error.message
        })
    }
})

export default userSlice.reducer