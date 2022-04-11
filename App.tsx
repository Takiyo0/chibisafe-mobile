import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Main from "./pages/Main";

const Stack = createNativeStackNavigator();

declare global {
  interface FormDataValue {
    uri: string;
    name: string;
    type: string;
  }

  interface FormData {
    append(name: string, value: FormDataValue, fileName?: string): void;
    set(name: string, value: FormDataValue, fileName?: string): void;
  }
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="home" component={Home} options={{ headerShown: false, headerStyle: { backgroundColor: "#1F2022" }, headerTitleStyle: { color: "white" } }} />
        <Stack.Screen name="main" component={Main} options={{ headerShown: false, headerStyle: { backgroundColor: "#1F2022" }, headerTitleStyle: { color: "white" } }} />
        <Stack.Screen name="login" component={Login} options={{ title: "Login", headerLeft: () => <></>, headerStyle: { backgroundColor: "#1F2022" }, headerTitleStyle: { color: "white" } }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}