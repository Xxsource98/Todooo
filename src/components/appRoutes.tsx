import React, { useContext } from "react";
import { Image } from "react-native";
import { createStackNavigator, StackCardInterpolationProps, StackNavigationOptions } from "@react-navigation/stack";

import Index from "../index";
import SelectedSection from "../screens/selectedSection";
import AddSection from "../screens/addSection";
import AddTask from "../screens/addTask";
import FinishedTasks from "../screens/finishedTasks";
import Settings from "../screens/settings";
import { TouchableOpacity } from "react-native-gesture-handler";
import { darkTheme, SectionContext, ThemeContext } from "./providers";
import { ThemeProps } from "../types";
import { RemoveSection } from "./getStorage";
import { DrawNotification } from "./notifications";
import ConfirmBox from "./confirmBox";

const closeImage = require('../../assets/images/section-remove-white.png');
const closeImageBlue = require('../../assets/images/section-remove-blue.png');

const Stack = createStackNavigator();

const GetDefaultScreenOptions = (theme: ThemeProps): StackNavigationOptions => {
    return {
        cardStyle: {
            backgroundColor: 'transparent'
        },
        cardStyleInterpolator: ({ current: { progress }}: StackCardInterpolationProps) => ({
            cardStyle: {
                opacity: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                }),
            },
            overlayStyle: {
                opacity: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.5],
                    extrapolate: 'clamp',
                }),
            },
        }),
        headerTintColor: theme.navigationText,
        headerTitle: 'Todooo',
        headerTitleAlign: 'center',
        headerStyle: {
            backgroundColor: theme.primary,
            shadowColor: theme.primary
        },         
    }
}   

const AppRoutes: React.FC<{}> = () => {
    const { theme } = useContext(ThemeContext);
    const { currentSection, changeSection } = useContext(SectionContext);
    
    const DrawHeaderRight: React.FC<{}> = () => {
        return (
            <TouchableOpacity style={{
                marginRight: 15,
                marginTop: -1
            }} activeOpacity={0.8} onPress={() => {
                ConfirmBox('Do You want delete this section?', async () => {
                    await RemoveSection(currentSection).then(success => {
                        if (success) {
                            changeSection('null');    
                            DrawNotification('Section Deleted', 'success');            
                        }
                        else DrawNotification('Failed to Delete Section', 'danger');
                    });
                });
            }}>
                <Image style={{
                    width: 26, height: 26
                }} source={theme === darkTheme ? closeImageBlue : closeImage} />
            </TouchableOpacity>
        )
    }

    return (
        <Stack.Navigator screenOptions={GetDefaultScreenOptions(theme)} initialRouteName='Index'>                
            <Stack.Screen name="Index" component={Index} />
            <Stack.Screen name="AddSection" component={AddSection} />
            <Stack.Screen name="SelectedSection" component={SelectedSection} options={{
                headerRight: () => <DrawHeaderRight />
            }} />
            <Stack.Screen name="AddTask" component={AddTask} />
        </Stack.Navigator>
    )
}

const SettingsRoutes: React.FC<{}> = () => {
    const { theme } = useContext(ThemeContext);

    return (
        <Stack.Navigator screenOptions={GetDefaultScreenOptions(theme)} initialRouteName='Index'>                
            <Stack.Screen name="Index" component={Settings} />
        </Stack.Navigator>
    )
}

const FinishedTasksRoutes: React.FC<{}> = () => {
    const { theme } = useContext(ThemeContext);

    return (
        <Stack.Navigator screenOptions={GetDefaultScreenOptions(theme)} initialRouteName='Index'>                
            <Stack.Screen name="Index" component={FinishedTasks} />
        </Stack.Navigator>
    )
}

export { AppRoutes, FinishedTasksRoutes, SettingsRoutes };