import React, { useCallback, useEffect, useState } from 'react'
import { View, StyleSheet, Image, Pressable, FlatList } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { SectionNavigationProps, TaskData } from '../types';

import CreateWidget from '../components/createWidget';
import { GetTasks } from '../components/getStorage';
import DrawContainer from '../components/drawContainer';
import AppText from '../components/appText';
import { useContext } from 'react';
import { ThemeContext, darkTheme, SectionContext } from '../components/providers';

const addIcon = require('../../assets/images/add.png');

const SelectedSection: React.FC<SectionNavigationProps> = props => {
    const { route, navigation } = props;
    const { name } = route.params;

    const isFocused = useIsFocused();
    const { theme } = useContext(ThemeContext);
    const { currentSection } = useContext(SectionContext);
    const [ refresh, shouldRefresh ] = useState<boolean>(false);
    const [ widgets, setWidgets ] = useState<Array<TaskData>>([]);

    const FetchWidgets = useCallback(async () => {
        await GetTasks(name).then(data => {
            setWidgets(data);
        });    
    }, [setWidgets]);

    useEffect(() => {
        const timer = setTimeout(async () => {
            shouldRefresh(!refresh);
        }, 60000);

        if (currentSection === 'null') {
            if (navigation.canGoBack()) {
                clearTimeout(timer);
                navigation.goBack();
            }
        }
        
        if (navigation !== null) {
            FetchWidgets(); 
        }

        return () => clearTimeout(timer);
    }, [isFocused, refresh, currentSection]);

    const SwitchToAdd = () => navigation.navigate('AddTask', {
        section: name
    });

    const DrawList: React.FC<{}> = () => {
        if (widgets.length !== 0) {
            return (
                <FlatList 
                    data={widgets.sort((a, b) => {
                        const aDate = new Date(a.endDate!);
                        const bDate = new Date(b.endDate!);

                        return aDate.getTime() - bDate.getTime()
                    })} 
                    renderItem={({ item }) => (
                        <CreateWidget 
                            type="task" 
                            name={item.name} 
                            sectionName={name}
                            onEndTask={() => shouldRefresh(!refresh)}
                            taskData={{
                                name: item.name,
                                description: item.description,
                                taskID: `${item.name} / ${item.endDate}`,
                                endDate: new Date(item.endDate),
                                endHour: item.endHour,
                                added: item.added,
                                color: item.color
                            }} />
                    )} 
                    keyExtractor={(item: TaskData, index: number) => index.toString()} 
                />
            )
        }

        return (
            <View style={sectionsStyle.middleAppTextContainer}>
                <AppText style={sectionsStyle.middleAppText}>There is nothing here :(</AppText>
            </View>
        );
    }

    return (
        <DrawContainer>
            <View style={{position: 'relative', height: '100%'}}>
                <DrawList />
            </View> 

            <Pressable style={[sectionsStyle.addButton, { backgroundColor: theme === darkTheme ? theme.primary : theme.primary }]} onPress={() => SwitchToAdd()}>
                <Image style={sectionsStyle.image} source={addIcon} />
            </Pressable>
        </DrawContainer>
    )
}

const sectionsStyle = StyleSheet.create({
    middleAppTextContainer: {
        position: 'absolute',
        display: 'flex',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    middleAppText: {
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
    image: {
        width: 26,
        height: 26,
        zIndex: 3
    }
});

export default SelectedSection;