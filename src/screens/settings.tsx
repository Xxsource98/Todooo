import React, { useCallback, useContext, useEffect, useState } from "react";
import { View, StyleSheet, Button } from 'react-native';
import Checkbox from 'expo-checkbox';

import { NavigationProps, ThemeProps } from "../types";
import { DeleteAllFinishedTasks, DeleteAllSections, DeleteAllTasks, LoadDarkModeState, SaveDarkModeState } from "../components/getStorage";
import { ThemeContext } from "../components/providers";
import DrawContainer from "../components/drawContainer";
import AppText from "../components/appText";

import PackageInfo from '../../package.json';
import ConfirmBox from "../components/confirmBox";
import { DrawNotification } from "../components/notifications";

const Settings: React.FC<NavigationProps> = props => {
    const { navigation } = props;

    const { theme } = useContext(ThemeContext);
    const [ darkTheme, setDarkTheme ] = useState<boolean>(false);


    const DrawSection: React.FC<{ title: string }> = props => {
        return (
            <View>
                <AppText style={{margin: 0, padding: 5, fontSize: 24, fontFamily: 'Montserrat Medium', }}>{props.title}</AppText>
                {props.children}
            </View>
        )
    }

    const DeleteSections = () => {
        ConfirmBox('Do you want delete all sections?', async () => {
            await DeleteAllSections().then(success => {
                if (success) DrawNotification('Sections Deleted', 'success');
                else DrawNotification('Failed to Delete Sections', 'danger');
            });
        });
    }

    const DeleteTasks = () => {
        ConfirmBox('Do you want delete all tasks?', async() => {
            await DeleteAllTasks().then(success => {
                if (success) DrawNotification('Tasks deleted', 'success');
                else DrawNotification('Failed to Delete tasks', 'danger');
            });
        });
    }

    const DeleteFinishedTasks = () => {
        ConfirmBox('Do You Want Delete All Finished Tasks?', async () => {
            await DeleteAllFinishedTasks().then(success => {
                if (success) DrawNotification('Finished Tasks Deleted', 'success');
                else DrawNotification('Failed to Delete Finished Tasks', 'danger');
            });
        });
    }

    const SetSaveTheme = (changeFunction: () => void) => {
        setDarkTheme(!darkTheme);
        changeFunction();
    }

    const FetchDarkTheme = useCallback(async () => {
        await LoadDarkModeState().then(loaded => {
            setDarkTheme(loaded);
        });
    }, []);

    useEffect(() => {
        FetchDarkTheme();
    }, []);
    
    const SettingsView: React.FC<{ theme: ThemeProps, change: () => void }> = props => {
        return (
            <View style={styles.container}>
                <DrawSection title="Theme">
                    <View style={styles.settingSection} onTouchStart={() => SetSaveTheme(props.change)}>
                        <Checkbox style={{width: 24, height: 24}} value={darkTheme} />
                        <AppText style={styles.settingSectionText}>Dark Theme</AppText>
                    </View>
                </DrawSection>
                <DrawSection title="Sections / Tasks">
                    <View style={styles.defaultContainer}>
                        <View style={styles.sectionsTasksButtons}>
                            <Button title="Delete All Sections" color={theme.primary} onPress={DeleteSections} />
                            <Button title="Delete All Tasks" color={theme.primary} onPress={DeleteTasks} />
                            <Button title="Delete Finished Tasks" color={theme.primary} onPress={DeleteFinishedTasks} />
                        </View>
                    </View>
                </DrawSection>
                <DrawSection title="App Info">
                    <View style={styles.defaultContainer}>
                        <AppText style={styles.appInfoText}>Current Version: {PackageInfo.version}</AppText>
                        <AppText style={styles.appInfoText}>Created by: Xxsource98</AppText>
                    </View>
                </DrawSection>
            </View>
        )
    }

    return (
        <DrawContainer>
           <ThemeContext.Consumer>
               {({ theme, change }) => <SettingsView theme={theme} change={change} />}
           </ThemeContext.Consumer>
        </DrawContainer>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '95%',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: 5,
        marginTop: 5
    },
    settingSection: {
        position: 'relative',
        display: 'flex',
        width: '100%',
        padding: 15,
        height: 40,
        justifyContent: 'center'
    },
    settingSectionText: {
        position: 'absolute',
        left: 50,
        fontSize: 16
    },
    defaultContainer: {
        position: 'relative',
        padding: 15
    },
    appInfoText: {
        padding: 3,
        fontSize: 16
    },
    sectionsTasksButtons: {
        position: 'relative',
        width: '60%',
        maxWidth: 250,
        height: 130,
        display: 'flex',
        justifyContent: 'space-between'
    }
});

export default Settings;