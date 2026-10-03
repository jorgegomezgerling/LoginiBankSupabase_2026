import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import SplashScreen from "../screens/SplashScreen";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import ConfirmPendingScreen from "../screens/auth/ConfirmPendingScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import NewPasswordScreen from "../screens/auth/NewPasswordScreen";

const Stack = createNativeStackNavigator();
const options = { headerShown: false };

function AuthStack({ initialRouteName }) {
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={options}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ConfirmPending" component={ConfirmPendingScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}

function RecoveryStack() {
  return (
    <Stack.Navigator screenOptions={options}>
      <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator screenOptions={options}>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  const { loading, isRecovery, session, authEntry } = useAuth();

  if (loading) return <SplashScreen />;

  return (
    <NavigationContainer>
      {isRecovery ? (
        <RecoveryStack />
      ) : session ? (
        <AppStack />
      ) : (
        <AuthStack initialRouteName={authEntry} />
      )}
    </NavigationContainer>
  );
}
