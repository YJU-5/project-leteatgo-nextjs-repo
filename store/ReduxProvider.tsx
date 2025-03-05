"use client"
import {  store } from "./Store";
import { Provider, useDispatch} from "react-redux";
import userProvider from "./UserCheck";
import AuthCheck from "./UserCheck";





export default function ReduxProvider({ children }: {children:React.ReactNode}) {
  return (
    <Provider store={store}>
      <AuthCheck>
          {children}
      </AuthCheck>
    </Provider>
  )
}