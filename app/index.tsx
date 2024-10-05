import { Text, View } from "react-native";
import store from './store/store';
import { Provider } from 'react-redux';
import Login from "./auth/login";

export default function Index() {
  return (
      <Provider store={store}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Login></Login>
        </View>
      </Provider>
  );
}
