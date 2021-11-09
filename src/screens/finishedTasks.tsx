import React, { useCallback, useEffect, useState } from 'react'
import { View, StyleSheet, FlatList } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { TaskData } from '../types';

import CreateWidget from '../components/createWidget';
import { GetFinishedTasks } from '../components/getStorage';
import DrawContainer from '../components/drawContainer';
import AppText from '../components/appText';

const FinishedTasks: React.FC<{}> = () => {
    const isFocused = useIsFocused();
    const [ widgets, setWidgets ] = useState<Array<TaskData>>([]);
    const [ refresh, shouldRefresh ] = useState<boolean>(false);

    const FetchWidgets = useCallback(async () => {
        await GetFinishedTasks().then(data => {
            setWidgets(data);
        }); 
    }, [setWidgets]);

    useEffect(() => {
        FetchWidgets(); 
        shouldRefresh(false);
    }, [isFocused, refresh]);

    const DrawList: React.FC<{}> = () => {
        if (widgets.length !== 0) {
            return (
                <FlatList data={widgets} renderItem={({ item }) => (
                    <CreateWidget 
                        type="finishedTask" 
                        name={item.name} 
                        onEndTask={() => shouldRefresh(true)}
                        taskData={{
                            name: item.name,
                            taskID: `${item.name} / ${item.endDate}`,
                            description: item.description,
                            endDate: new Date(item.endDate),
                            endHour: item.endHour,
                            added: item.added,
                            color: item.color
                        }} />
                )} keyExtractor={(item: TaskData, index: number) => index.toString()}/>
            )
        }
        
        return (
            <View style={styles.middleTextContainer}>
                <AppText style={styles.middleText}>There is nothing here :(</AppText>
            </View>
        );
    }

    return (
        <DrawContainer>
            <View style={{position: 'relative', height: '100%'}}>
                <DrawList />
            </View>
        </DrawContainer>
    )
}

const styles = StyleSheet.create({
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
})

export default FinishedTasks;