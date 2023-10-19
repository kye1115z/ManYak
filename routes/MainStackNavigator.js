import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import SplashPage from "../screens/SplashPage";

const Stack = createStackNavigator();

function MainStackNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="SplashPage">
                <Stack.Screen name="SplashPage" component={SplashPage} options={{headerShown: false}} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default MainStackNavigator;