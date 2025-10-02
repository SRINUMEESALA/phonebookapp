import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { View, ActivityIndicator } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppDispatch, RootState } from "../store";
import { getProfile } from "../store/slices/authSlice";
import { loadFavorites } from "../store/slices/favoritesSlice";
import { APP_CONSTANTS, COLORS, ROUTES } from "../constants";

import LoginScreen from "../screens/LoginScreen";
import AddressBookScreen from "../screens/AddressBookScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ContactDetailScreen from "../screens/ContactDetailScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === ROUTES.ADDRESS_BOOK) {
            iconName = focused ? "people" : "people-outline";
          } else if (route.name === ROUTES.FAVORITES) {
            iconName = focused ? "heart" : "heart-outline";
          } else if (route.name === ROUTES.PROFILE) {
            iconName = focused ? "person" : "person-outline";
          } else {
            iconName = "help-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.PRIMARY,
        tabBarInactiveTintColor: COLORS.TEXT_SECONDARY,
        headerShown: false,
      })}
    >
      <Tab.Screen
        name={ROUTES.ADDRESS_BOOK}
        component={AddressBookScreen}
        options={{ title: "Address Book" }}
      />
      <Tab.Screen
        name={ROUTES.FAVORITES}
        component={FavoritesScreen}
        options={{ title: "Favorites" }}
      />
      <Tab.Screen
        name={ROUTES.PROFILE}
        component={ProfileScreen}
        options={{ title: "My Profile" }}
      />
    </Tab.Navigator>
  );
};

const MainStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.MAIN_TABS} component={MainTabNavigator} />
      <Stack.Screen
        name={ROUTES.CONTACT_DETAIL}
        component={ContactDetailScreen as any}
        options={{
          headerShown: false,
          presentation: "card",
        }}
      />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      const token = await AsyncStorage.getItem(
        APP_CONSTANTS.STORAGE_KEYS.ACCESS_TOKEN
      );
      if (token) {
        try {
          // Await profile hydration to avoid route flicker
          await dispatch(getProfile()).unwrap();
        } catch (e) {}
      }
      dispatch(loadFavorites());
      setIsInitializing(false);
    };

    initializeApp();
  }, [dispatch]);

  if (isInitializing) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainStackNavigator /> : <LoginScreen />}
    </NavigationContainer>
  );
};

export default AppNavigator;
