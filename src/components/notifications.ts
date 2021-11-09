import { MessageType, showMessage } from "react-native-flash-message";

const DrawNotification = (description: string, type: MessageType) => {
    const title = type === "danger" ? "Error" : (type.charAt(0).toUpperCase() + type.slice(1));

    showMessage({
        message: title,
        description: description,
        type: type,
        titleStyle: {
            fontFamily: 'Montserrat Medium',
            fontSize: 18
        },
        textStyle: {
            fontFamily: 'Montserrat Light',
            fontSize: 16
        }
    });
}

export { DrawNotification };