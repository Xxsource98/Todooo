import React, { useState } from "react";
import { View, StyleSheet, TextInput, Button } from 'react-native';
import { SectionData } from "../types";
import { DrawNotification } from "../components/notifications";
import { CreateSection } from "../components/getStorage";
import DrawContainer from "../components/drawContainer";
import AppText from "../components/appText";
import { useContext } from "react";
import { ThemeContext } from "../components/providers";

const AddSection: React.FC<{}> = () => {
    const { theme } = useContext(ThemeContext);
    const [ sectionName, setSectionName ] = useState<string>("");

    const SaveSection = async () => {
        if (sectionName) {
            const sectionData: SectionData = {
                name: sectionName,
                added: new Date() 
            }

            await CreateSection(sectionData).then(success => {
                if (success) DrawNotification("Task Added", 'success');
                else DrawNotification("Failed to Add Task", 'danger');
            });
        }
        else DrawNotification('Section Name is Empty!', 'danger');
    }

    const placeholderColor: string = `${theme.font}a1`;

    return (
        <DrawContainer>
            <View style={styles.container}>
                <AppText style={styles.headerText}>Let's add new section!</AppText>
                <View style={styles.formContainer}>
                    <TextInput placeholder="Section Name" placeholderTextColor={placeholderColor} style={[styles.input, {color: theme.font}]} onChangeText={setSectionName} value={sectionName} />

                    <View style={styles.buttonContainer}>
                        <Button title="Add" color={theme.primary} onPress={SaveSection}></Button>
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
        width: 120
    }
});

export default AddSection;