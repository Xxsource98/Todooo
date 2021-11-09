import { NavigationProp, ParamListBase, RouteProp, NavigatorScreenParams } from '@react-navigation/native';
import { TextProps } from 'react-native';

export interface SectionWidgetProps {
    name: string,
    remaining: number
}

export interface SectionNavigationProps {
    route: RouteProp<{ params: SectionWidgetProps }, 'params'>,
    navigation: NavigationProp<ParamListBase>
}

export interface SectionData {
    name: string,
    added: Date
}

export interface NavigationProps {
    navigation: NavigationProp<ParamListBase>
}

export interface TaskNavigationProps {
    route: RouteProp<{ params: { section: string } }, 'params'>,
    navigation: NavigationProp<ParamListBase>
}

export interface CreateWidgetProps {
    type: WidgetType,
    name: string,
    remaining?: number,
    taskData?: TaskData,
    sectionName?: string,
    onEndTask?: () => void,
    onPress?: () => void
}

export interface ColorPickerProps {
    colors: Array<string>,
    selectedColor: (color: string) => void
}

export interface DrawColorProps {
    color: string,
    isSelected: Boolean
}

export interface AppTextProps extends TextProps {
    isNavigation?: Boolean
}

export type ThemeProps = {
    background: string,
    primary: string,
    press: string,
    font: string,
    navigationText: string
}

export type TaskData = {
    name: string,
    description?: string,
    taskID: string,
    endDate: Date,
    endHour: { hour: number, minutes: number },
    added: Date,
    color?: string
}

export declare type WidgetType = "task" | "section" | "finishedTask";
export declare type RegisterNotificationData = { success: boolean, token: string };
export declare type BlankFunction = () => void;
export declare type CalculateType = "Date" | "Time";