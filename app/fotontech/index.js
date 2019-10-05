import { registerRootComponent } from "expo";
import React from "react";
import App from "./src/App";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import store from "./src/store";
import { Provider } from "react-redux";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "darkblue",
    accent: "yellow"
  }
};

export default function Main() {
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <App />
      </PaperProvider>
    </Provider>
  );
}
registerRootComponent(Main);
