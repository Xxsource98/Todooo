import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ColorPickerProps, DrawColorProps, ThemeProps } from '../types';

const accept = require('../../assets/images/accept.png');

const ColorsForPick = [
    "#d35400", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50", "#f39c12", "#FC427B"
];

const ColorPicker: React.FC<ColorPickerProps & { theme: ThemeProps }> = props => {
    const [ colorsArray, setColorsArray ] = useState<Array<DrawColorProps>>([]);
    const [ refresh, shouldRefresh ] = useState<Boolean>(false);

    useEffect(() => {
        setColorsArray([]);
        for (const [index, color] of props.colors.entries()) {
            index === 0 ? props.selectedColor(color) : null;

            setColorsArray(data => [...data, {
                color: color,
                isSelected: index === 0 ? true : false
            }]);
        }
    }, []);

    const CreatePalette: React.FC<{}> = () => {
        const DrawColor: React.FC<DrawColorProps> = colorProps => {
            const { color, isSelected } = colorProps;
            
            const SelectColor = () => {
                for (const currentColor of colorsArray) {
                    if (currentColor.color === color) {
                        props.selectedColor(currentColor.color);

                        currentColor.isSelected = true;
                    }
                    else currentColor.isSelected = false;
                }

                shouldRefresh(!refresh);
            }

            return (
                <View style={styles.colorContainer}>
                    <TouchableOpacity activeOpacity={0.9} onPress={SelectColor} style={[styles.color, { backgroundColor: color }]}><Text></Text></TouchableOpacity>
                    <View style={styles.imageContainer}>
                        <Image source={accept} style={isSelected ? styles.activeColor : {display: 'none'}} />
                    </View>
                </View>
            )
        }

        return (
            <FlatList 
                data={colorsArray}
                horizontal={true}
                extraData={refresh}
                renderItem={({ item }) => (
                    <DrawColor color={item.color} isSelected={item.isSelected} />
                )}
                keyExtractor={(item: DrawColorProps, index: number) => index.toString()}
            />
        )
    }

    return (
        <View style={styles.container}>
            <Text style={[styles.headerText, {color: props.theme.font}]}>Task Color</Text>
            <CreatePalette />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        left: 0,
        width: '100%'
    },
    headerText: {
        fontSize: 24,
        fontFamily: 'Montserrat Medium',
        marginBottom: 15
    },
    colorContainer: {
        padding: 5
    },
    color: {
        width: 36,
        height: 36,
        borderRadius: 100,
    },
    imageContainer: {
        width: 46,
        height: 46,
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeColor: {
        width: 24,
        height: 24,
        top: 0,
        left: 0
    }
});

export { ColorsForPick, ColorPicker };