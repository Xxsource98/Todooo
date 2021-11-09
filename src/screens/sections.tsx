import React, { useState, useEffect, useContext, useCallback } from "react";
import { View, StyleSheet, Image, Pressable, FlatList } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import { SectionWidgetProps, NavigationProps } from "../types";
import CreateWidget from "../components/createWidget";
import { GetSections } from "../components/getStorage";
import DrawContainer from "../components/drawContainer";
import AppText from "../components/appText";
import { ThemeContext, darkTheme, SectionContext } from "../components/providers";

const addIcon = require('../../assets/images/add.png');

const Sections: React.FC<NavigationProps> = props => {
    const { navigation } = props;
    
    const isFocused = useIsFocused();
    const { theme } = useContext(ThemeContext);
    const { changeSection } = useContext(SectionContext);
    const [ sections, setSections ] = useState<Array<SectionWidgetProps>>([]);

    const FetchWidgets = useCallback(async () => {
        await GetSections().then(data => {
            setSections(data);
        }); 
    }, [setSections]);

    useEffect(() => {
        FetchWidgets();     
    }, [isFocused]);

    const SwitchToAdd = () => navigation.navigate('AddSection');
    const SwitchToSection = (sectionName: string, remain: number) => { 
        changeSection(sectionName);
        navigation.navigate('SelectedSection', { name: sectionName, remaining: remain});
    }

    const DrawList: React.FC<{}> = () => {
        if (sections.length !== 0) {
            return (
                <FlatList data={sections} renderItem={({ item }) => (
                    <CreateWidget 
                        type="section" 
                        onPress={() => SwitchToSection(item.name, item.remaining)} 
                        name={item.name} 
                        remaining={item.remaining} />
                )} keyExtractor={(item: SectionWidgetProps, index: number) => index.toString()}/>
            )
        }

        return (
            <View style={sectionsStyle.middleTextContainer}>
                <AppText style={sectionsStyle.middleText}>There is nothing here :(</AppText>
            </View>
        );
    }

    return (
        <DrawContainer>
            <View style={{position: 'relative', height: '100%'}}>
                <DrawList />
            </View>

            <Pressable style={[sectionsStyle.addButton, { backgroundColor: theme === darkTheme ? theme.primary : theme.primary }]} onPress={() => SwitchToAdd()}>
                <Image style={sectionsStyle.addButtonImage} source={addIcon} />
            </Pressable>
        </DrawContainer>
    )
}

const sectionsStyle = StyleSheet.create({
    middleTextContainer: {
        position: 'absolute',
        display: 'flex',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    middleText: {
        fontSize: 20,
        fontFamily: 'Montserrat Medium'
    },
    addButton: {
        position: 'absolute',
        bottom: 25,
        right: 25,
        width: 48,
        height: 48,
        borderRadius: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    addButtonImage: {
        width: 26,
        height: 26,
        zIndex: 3
    }
});

export default Sections;