import React, { useContext } from "react";
import { StyleProp, Text, TextStyle } from "react-native";
import { AppTextProps } from "../types";
import { ThemeContext } from "./providers";

const AppText: React.FC<AppTextProps> = props => {
    const { theme } = useContext(ThemeContext);

    const defaultStyle: StyleProp<TextStyle> = {
        color: theme.font
    }

    const navigationStyle: StyleProp<TextStyle> = {
        color: theme.navigationText
    }

    return (
        <Text {...props} style={[props.isNavigation ? navigationStyle : defaultStyle, props.style]}>{props.children}</Text>
    )
}

export default AppText;