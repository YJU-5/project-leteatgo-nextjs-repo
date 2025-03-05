"use client"
import {  store } from "./Store";
import { Provider, useDispatch} from "react-redux";





export default function ReduxProvider({ children }: {children:React.ReactNode}) {
  return (
    <Provider store={store}>
          {children} 
    </Provider>
  )
}