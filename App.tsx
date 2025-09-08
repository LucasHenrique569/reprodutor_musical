import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";


import HomeScreen from "./screens/HomeScreen";
import PlayListScreen from "./screens/PlayListScreen";
import LoginScreens from "./screens/LoginScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator id={undefined} initialRouteName="Login">
         <Stack.Screen
          name="Login"
          component={LoginScreens}
          options={{ title: "Seja bem-vindo!" }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Página Inicial" }}
        />
        <Stack.Screen
          name="PlayList"
          component={PlayListScreen}
          options={{ title: "Minha PlayList" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

  
