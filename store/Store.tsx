import { configureStore } from '@reduxjs/toolkit';
import userReducer from './UserSlice';

export const store = configureStore({
  reducer: {
    user: userReducer
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


// const user = useSelector((state:RootState)=> state.user.user);
// const token = useSelector((state:RootState)=> state.user.jwtToken);