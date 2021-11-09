import React from "react";
import { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { ThemeContext } from "./providers";

const DrawContainer: React.FC<{ children: React.ReactNode }> = props => {
    const { theme } = useContext(ThemeContext);

    return (
        <View style={[sectionStyle.container, { backgroundColor: theme.background }]}>
            {props.children}
        </View>
    )
}

const sectionStyle = StyleSheet.create({
    container: {
        position: 'relative',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        padding: 10,
        paddingHorizontal: 5
    },
});

export default DrawContainer;