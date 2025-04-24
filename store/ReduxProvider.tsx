"use client";
import { store } from "./Store";
import { Provider } from "react-redux";
import AuthCheck from "./UserCheck";

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <AuthCheck>{children}</AuthCheck>
    </Provider>
  );
}
