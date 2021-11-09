import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Animated } from 'react-native';

import { CalculateType, CreateWidgetProps } from '../types';
import { DeleteFinishedTask, DeleteTask, EndTask } from './getStorage';
import { DrawNotification } from './notifications';
import ConfirmBox from './confirmBox';

const arrow = require('../../assets/images/arrow.png');
const decline = require('../../assets/images/close.png');
const accept = require('../../assets/images/accept.png');

const CreateWidget: React.FC<CreateWidgetProps> = props => {
    const { type, name, remaining, taskData, sectionName, onEndTask, onPress } = props;
    const [ dropdown, setDropdown ] = useState<boolean>(false);
    const heightAnim = useState(new Animated.Value(100))[0];
    const rotateAnim = useState(new Animated.Value(0))[0];

    // Date in Days
    // Time in Minutes
    const CalculateDifference = (type: CalculateType, start: Date, end: Date): number => {
        switch (type) {
            case "Date": return Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
            case "Time": return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60));

            default: return 0;
        }
    }

    const CreateDeadline = (end: Date, endHour: number, endMinute: number): Date => {
        const date = new Date(end);

        date.setHours(endHour);
        date.setMinutes(endMinute);
        date.setSeconds(0, 0);

        return date;
    }

    if (type === "section") {
        return (
            <TouchableOpacity delayPressIn={150} activeOpacity={0.7} style={widget.container} onPress={onPress}>
                <View style={widget.widgetContainer}>
                    <View style={widget.text}>
                        <Text style={widget.title}>{name}</Text>
                        <Text style={widget.remain}>{`${remaining} tasks remaining`}</Text>
                    </View>
                    <View style={widget.imageContainer}>
                        <Image style={widget.image} source={arrow} />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    if (type === "task" || type === "finishedTask") {
        const currentDate = new Date();
        const isFinishedTask = type === "finishedTask";
        const deadline: Date = CreateDeadline(taskData?.endDate!, taskData?.endHour.hour!, taskData?.endHour.minutes!);
        const remain = CalculateDifference("Date", currentDate, deadline);

        const CreateDrawDate = (date: Date): string => {
            const GetTime = (time: number): string => { return String('0' + time).slice(-2); }

            return `${GetTime(date.getDate())}.${GetTime(date.getMonth() + 1)}.${date.getFullYear()} ${GetTime(date.getHours())}:${GetTime(date.getMinutes())}`;
        }
        
        const AnimateDropdown = (close: boolean) => {
            Animated.timing(heightAnim, {
                toValue: close ? 100 : 165,
                duration: 200,
                useNativeDriver: false
            }).start();

            Animated.timing(rotateAnim, {
                toValue: close ? 0 : 1,
                duration: 200,
                useNativeDriver: true
            }).start();
        }

        const ToggleDropdown = () => {
            if (taskData?.description) {
                setDropdown(!dropdown);
                AnimateDropdown(dropdown);
            }
        }

        const OnDeleteTask = async () => {
            if (sectionName !== undefined) {   
                ConfirmBox("Delete Task", async () => {
                    await DeleteTask(sectionName, name).then(success => {
                        if (success && onEndTask !== undefined) {
                            onEndTask();
                            DrawNotification("Task Deleted", 'success');
                        }
                        else DrawNotification("Failed to Delete Task", 'danger');
                    });
                });
            }
        }

        const OnEndTask = async () => {         
            if (sectionName !== undefined && taskData !== undefined) {   
                ConfirmBox("Finish Task", async () => {
                    await EndTask(sectionName, name, taskData).then(success => {
                        if (success && onEndTask !== undefined) {
                            onEndTask();
                            DrawNotification("Task Finished", 'success');
                        }
                        else DrawNotification("Failed to Finish Task", 'danger');
                    });
                });
            } 
        }

        const OnDeleteFinishedTask = async () => {
            if (taskData?.taskID !== undefined) {
                ConfirmBox("Delte Task", async () => {
                    await DeleteFinishedTask(taskData.taskID).then(success => {
                        if (success && onEndTask !== undefined) {
                            onEndTask();
                            DrawNotification("Task Deleted", 'success');
                        }
                        else DrawNotification("Failed to Delete Task", 'danger');
                    })
                });
            }
        }

        const rotateDeg = rotateAnim.interpolate({
            inputRange: [ 0, 1 ],
            outputRange: [ '270deg', '450deg' ]
        });

        const dropdownStyle = [widget.widgetContainer, { backgroundColor: taskData?.color }, {height: heightAnim}];
        const arrowStyle = [widget.bottomArrow, !taskData?.description ? widget.bottomArrowHidden : {}, {transform: [ { rotate: rotateDeg }]} ];
        const descriptionStyle = [widget.dropdownText, dropdown ? widget.dropdownTextActive : {}];

        const GetTitleText = (): string => {
            let titleText = '';

            if (!isFinishedTask) {
                if (remain > 1) {
                    titleText = remain === 1 ? 'Today' : `In ${remain} Days`;
                }
                else if (remain <= 1) {
                    const remainMinutes = CalculateDifference("Time", currentDate, deadline);

                    if (remainMinutes > 0 && remainMinutes < 60) {
                        titleText = `In ${remainMinutes} ${remainMinutes === 1 ? 'Minute' : 'Minutes'}`;
                    }
                    else if (remainMinutes > 60) {
                        const remainHours = Math.floor(remainMinutes / 60);

                        titleText = `In ${remainHours} ${remainHours === 1 ? 'Hour' : 'Hours'}`;
                    }
                    else if (remainMinutes === 0) {
                        titleText = 'Ended';
                    }
                    else if (remainMinutes === 1) {
                        titleText = `In a moment`;
                    }
                    else {
                        titleText = 'Ended';
                    }
                }
                else {
                    titleText = 'Ended';
                }
            }
            else titleText = CreateDrawDate(deadline);

            return titleText;
        }

        return (
            <TouchableOpacity delayPressIn={150} activeOpacity={0.7} style={widget.container} onPress={ToggleDropdown}>
                <Animated.View style={dropdownStyle}>
                    <Animated.View style={widget.text}>
                        <Text style={widget.title}>{GetTitleText()}</Text>
                        <Text style={widget.remain}>{name}</Text>
                    </Animated.View>
                    <View style={!isFinishedTask ? widget.rightContainer : {display: 'none'}}>
                        <Text style={widget.deadline}>{CreateDrawDate(deadline)}</Text>
                        <View style={widget.iconsContainer}>
                            <TouchableOpacity delayPressIn={150} activeOpacity={0.4} onPress={OnDeleteTask}>
                                <Image style={widget.icon} source={decline} />
                            </TouchableOpacity>
                            <TouchableOpacity delayPressIn={150} activeOpacity={0.4} onPress={OnEndTask}>
                                <Image style={widget.icon} source={accept} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={isFinishedTask ? widget.rightClose : {display: 'none'}}>
                        <TouchableOpacity delayPressIn={150} activeOpacity={0.4} onPress={OnDeleteFinishedTask}>
                            <Image style={widget.icon} source={decline} />
                        </TouchableOpacity>
                    </View>
                    <View style={widget.bottomArrowContainer}>
                        <Animated.Image style={arrowStyle} source={arrow} />
                    </View>
                    <View style={widget.dropdownDescription}>
                        <Text style={descriptionStyle}>{taskData?.description}</Text>
                    </View>
                </Animated.View>
            </TouchableOpacity>
        )
    }

    return (<></>)
}

const widget = StyleSheet.create({
    container: {
        position: 'relative',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        paddingVertical: 8
    },
    widgetContainer: {
        position: 'relative',
        backgroundColor: '#57ABFF',
        width: '86%',
        borderRadius: 15,
        height: 100,
        justifyContent: 'space-between',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    text: {
        display: 'flex',
        flexDirection: 'column',
        padding: 12,
        height: '100%',
        width: '66%'
    },
    title: {
        color: '#fff',
        fontFamily: 'Montserrat Medium',
        fontSize: 24
    },
    remain: {
        color: '#fff',
        fontFamily: 'Montserrat Light',
        fontSize: 16,
        marginLeft: 5,
        position: 'relative',
        width: '100%'
    },
    imageContainer: {
        position: 'absolute',
        right: 0,
        height: '100%',
        width: 50,
        display: 'flex',
        justifyContent: 'center',
    },
    image: {
        position: 'absolute',
        right: -5,
        width: 64,
        height: 64,
    },
    rightContainer: {
        position: 'absolute',
        right: 0,
        display: 'flex',
        padding: 12,
        height: '100%',
        alignItems: 'flex-end',
    },
    rightClose: {
        position: 'absolute',
        display: 'flex',
        padding: 12,
        height: 100,
        right: 0,
        top: 0,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    deadline: {
        color: '#fff',
        fontFamily: 'Montserrat Medium',
        fontSize: 18,
        marginTop: 3
    },
    iconsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: 80,
        marginTop: 10
    },
    icon: {
        width: 35,
        height: 35
    },
    bottomArrowContainer: {
        display: 'flex',
        position: 'absolute',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
        height: 100,
        left: 0,
        top: 0
    },
    bottomArrow: {
        width: 43,
        height: 43,
    },
    bottomArrowHidden: {
        display: 'none'
    },
    dropdownDescription: {
        position: 'absolute',
        padding: 10,
        width: '100%',
        top: 85
    },
    dropdownText: {
        display: 'none',
        color: '#fff',
        fontFamily: 'Montserrat Medium',
        fontSize: 16,
        textAlign: 'center'
    },
    dropdownTextActive: {
        display: 'flex'
    }
});

export default CreateWidget;