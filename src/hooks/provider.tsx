"use client"
import { Provider } from "react-redux";
import { store } from "./store";

interface ReactChildren {
    children: React.ReactNode;
}

export default function ReduxProvider({ children }: ReactChildren) {
    return <Provider store={store}>{children}</Provider>
}