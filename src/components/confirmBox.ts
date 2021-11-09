import { Alert } from "react-native";
import { BlankFunction } from "../types";

const ConfirmBox = (title: string, onConfirm: BlankFunction, description?: string): void => {
    Alert.alert(title, description ? description : "Are You Sure?", [
        { text: 'No', onPress: () => {} },
        { text: 'Yes', onPress: onConfirm }
    ]);
}

export default ConfirmBox;