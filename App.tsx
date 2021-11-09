import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import FlashMessage from "react-native-flash-message";
import { LoadDarkModeState, SaveDarkModeState } from "./src/components/getStorage";

import { darkTheme, lightTheme, ThemeContext, SectionContext } from './src/components/providers';
import { ThemeProps } from "./src/types";
import Sidebar from './src/components/sidebar';

/*
    TODO: 
    
    Fix: Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
    Add: Max length on title input on task and section name

*/

const App = () => {
    const [ currentTheme, setCurrentTheme ] = useState<ThemeProps>(lightTheme);
    const [ currentSection, setCurrentSection ] = useState<string>("null");

    const [ fontsLoaded ] = useFonts({
        'Montserrat Light': require('./assets/fonts/Montserrat-Light.ttf'),
        'Montserrat Medium': require('./assets/fonts/Montserrat-Medium.ttf'),
        'Montserrat Regular': require('./assets/fonts/Montserrat-Regular.ttf'),
        'Montserrat SemiBold': require('./assets/fonts/Montserrat-SemiBold.ttf'),
    });

    FlashMessage.setColorTheme({
        success: '#6ab04c',
        info: '#686de0',
        warning: '#eb4d4b'
    });

    const SwitchTheme = async () => {
        setCurrentTheme(currentTheme === lightTheme ? darkTheme : lightTheme);
        await SaveDarkModeState(currentTheme === darkTheme);
    }
    const SwitchSection = (newSection: string) => setCurrentSection(newSection);

    useEffect(() => {
        LoadDarkModeState().then(loaded => {
            setCurrentTheme(loaded ? darkTheme : lightTheme);
        });
    })

    if (!fontsLoaded) return (<AppLoading />)
    else {
        return (
            <View style={{ flex: 1 }}>
                <ThemeContext.Provider value={{
                    theme: currentTheme,
                    change: SwitchTheme
                }}>
                    <SectionContext.Provider value={{
                        currentSection: currentSection,
                        changeSection: SwitchSection
                    }}>
                        <NavigationContainer>
                            <Sidebar />
                        </NavigationContainer>
                        <FlashMessage position="bottom" />
                    </SectionContext.Provider>
                </ThemeContext.Provider>
            </View>
        )
    }
}

export default App;