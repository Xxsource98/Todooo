import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { createDrawerNavigator, DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList, DrawerNavigationOptions } from '@react-navigation/drawer';

import { AppRoutes, SettingsRoutes, FinishedTasksRoutes } from "./appRoutes";
import AppText from './appText';
import { ThemeContext } from './providers';
import { ThemeProps } from '../types';

const Navigate = createDrawerNavigator();

const CustomDrawerContent = (props: { theme: ThemeProps } & DrawerContentComponentProps) => {
    return (
        <View style={[customStyle.customDrawerContainer, { backgroundColor: props.theme.primary }]}>
            <View style={customStyle.headerContainer}>
                <AppText style={customStyle.headerText} isNavigation={true}>Todooo</AppText>
            </View>
            <DrawerContentScrollView>
                <DrawerItemList {...props}/>
            </DrawerContentScrollView>
            <View style={customStyle.creditContainer}>
                <AppText style={[customStyle.creditText, { color: props.theme.navigationText} ]}>Created by Xxsource98</AppText>
            </View>
        </View>
    )
}

const Sidebar: React.FC<{}> = () => {
    const { theme } = useContext(ThemeContext);

    const navigatorStyle: DrawerNavigationOptions = {
        headerShown: false, 
        drawerActiveTintColor: theme.navigationText, 
        drawerInactiveTintColor: theme.navigationText, 
        drawerStyle: {
            backgroundColor: theme.primary, 
        },
        drawerLabelStyle: {
            color: theme.navigationText, 
            fontFamily: 'Montserrat Regular',
            fontSize: 17,
        },
        swipeEdgeWidth: 300,
        drawerActiveBackgroundColor: theme.press, 
    }
    
    return (
        <Navigate.Navigator drawerContent={(props) => <CustomDrawerContent theme={theme} {...props} />} screenOptions={navigatorStyle} initialRouteName='Sections'>
            <Navigate.Screen name='Sections' component={AppRoutes} />
            <Navigate.Screen name='Finished Tasks' component={FinishedTasksRoutes} />
            <Navigate.Screen name='Settings' component={SettingsRoutes} />
        </Navigate.Navigator>
    )
}

const customStyle = StyleSheet.create({
    customDrawerContainer: {
        position: 'relative',
        top: 35, 
        flex: 1
    },
    headerContainer: {
        position: 'relative',
        width: '100%',
        height: 60,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerText: {
        position: 'relative',
        top: 15,
        fontSize: 28,
        fontFamily: 'Montserrat Light'
    },
    creditContainer: {
        width: '100%',
        position: 'absolute',
        bottom: 55,
    },
    creditText: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Montserrat Light',
    }
})

export default Sidebar;