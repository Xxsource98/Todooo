import React, { useContext, useState } from "react";
import { View, StyleSheet, Text, TextInput, Button } from 'react-native';
import { DatePicker } from "react-native-woodpicker";
import { TaskData, TaskNavigationProps } from "../types";

import { SaveTask } from "../components/getStorage";
import { DrawNotification } from "../components/notifications";
import { ColorPicker, ColorsForPick } from "../components/colorPicker";
import DrawContainer from "../components/drawContainer";
import AppText from "../components/appText";
import { ThemeContext } from "../components/providers";

const GenerateDateForTask = () => {
    const currentDate = new Date(Date.now());
    currentDate.setMinutes(currentDate.getMinutes() + 1);
    currentDate.setSeconds(0);

    return currentDate;
}

const AddTask: React.FC<TaskNavigationProps> = props => {
    const { route } = props;
    const { section } = route.params;

    const { theme } = useContext(ThemeContext);
    const [ selectedColor, setSelectedColor ] = useState<string>("");
    const [ taskName, setTaskName ] = useState<string>("");
    const [ taskDescription, setTaskDescription ] = useState<string>("");
    const [ pickedDate, setPickedDate ] = useState<Date>(GenerateDateForTask());

    const getTime = (time: number): string => { return String('0' + time).slice(-2); }

    const handleText = (): string => pickedDate ? `${pickedDate.getDate()}.${pickedDate.getMonth() + 1}.${pickedDate.getFullYear()}` : "No date selected";
    const handleTime = (): string => pickedDate ? `${getTime(pickedDate?.getHours())}:${getTime(pickedDate?.getMinutes())}` : "No hour selected";

    const SaveTaskData = async () => {
        if (taskName && pickedDate) {
            const currentDate = new Date();

            if (pickedDate > currentDate) {
                const sectionData: TaskData = {
                    name: taskName,
                    description: taskDescription,
                    taskID: `${taskName} / ${pickedDate}`,
                    endDate: pickedDate,
                    endHour: {
                        hour: pickedDate.getHours(),
                        minutes: pickedDate.getMinutes()
                    },
                    added: new Date(),
                    color: selectedColor
                }

                await SaveTask(section, sectionData).then(success => {
                    if (success) DrawNotification('Task Added', 'success');
                    else DrawNotification('Task Already Exist!', 'danger');
                });
            }
            else DrawNotification('Invalid Time', 'danger');
        }
        else DrawNotification('Fields are Empty!', 'danger');
    }

    const placeholderColor: string = `${theme.font}a1`;

    return (
        <DrawContainer>
            <View style={styles.container}>
                <AppText style={styles.headerText}>Let's add new task!</AppText>
                <View style={styles.formContainer}>
                    <TextInput placeholder="Task Name" maxLength={35} placeholderTextColor={placeholderColor} style={[styles.input, {color: theme.font}]} onChangeText={setTaskName} value={taskName} />
                    <TextInput placeholder="Task Description" placeholderTextColor={placeholderColor} maxLength={150} style={[styles.input, {color: theme.font}]} onChangeText={setTaskDescription} value={taskDescription} />    
                    <DatePicker
                        value={pickedDate}
                        onDateChange={(date: Date | null) => setPickedDate(date!)}
                        title="Date Picker"
                        text={handleText()}
                        androidMode="date"
                        androidDisplay="default"
                        iosMode="date"
                        iosDisplay="inline"
                        minimumDate={GenerateDateForTask()}
                        textInputStyle={{
                            color: theme.font,
                            fontSize: 20,
                            fontFamily: 'Montserrat Regular',
                        }}
                        isNullable={true}
                        style={styles.input}
                    />
                    <DatePicker
                        value={pickedDate}
                        onDateChange={(date: Date | null) => setPickedDate(date!)}
                        title="Time Picker"
                        text={handleTime()}
                        androidMode="time"
                        iosMode="time"
                        iosDisplay="inline"
                        minimumDate={GenerateDateForTask()}
                        androidDisplay="default"    
                        textInputStyle={{
                            color: theme.font,
                            fontSize: 20,
                            fontFamily: 'Montserrat Regular',
                        }}
                        isNullable={true}
                        style={styles.input}
                    />
                    <ColorPicker colors={ColorsForPick} theme={theme} selectedColor={(color: string) => setSelectedColor(color)} />

                    <View style={styles.buttonContainer}>
                        <Button title="Add" color={theme.primary} onPress={SaveTaskData}></Button>
                    </View>
                </View>
            </View>
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
    headerText: {
        fontSize: 24,
        fontFamily: 'Montserrat Medium',
        marginBottom: 15
    },
    formContainer: {
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-end'
    },
    input: {
        width: '100%',
        height: 50,
        marginBottom: 15,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#9B9B9B',
        borderRadius: 5,
        fontSize: 20,
        fontFamily: 'Montserrat Regular',
        padding: 10
    },
    buttonContainer: {
        position: 'relative',
        right: 0,
        width: 120,
        top: 10
    }
});

export default AddTask;