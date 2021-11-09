import AsyncStorage from '@react-native-async-storage/async-storage';
import { SectionData, SectionWidgetProps, TaskData } from "../types";

export const GetSections = (): Promise<Array<SectionWidgetProps>> => {
    return new Promise(async (res, rej) => {
        const getRemaining = async (section: string): Promise<number> => {
            const sectionName = `Section-${section}`;
            let currentStorage: Array<TaskData> = [];

            await AsyncStorage.getItem(sectionName).then(tasks => {
                if (tasks !== null) {
                    currentStorage = JSON.parse(tasks);
                }
            });

            return currentStorage.length;
        }

        const dataToAppend = async (sectionData: SectionData): Promise<SectionWidgetProps> => {       
            return new Promise(async (res, rej) => {
                let newObject: SectionWidgetProps = { name: "", remaining: 0 };

                newObject.name = sectionData.name;
                await getRemaining(sectionData.name).then(data => {
                    newObject.remaining = data;
                });
    
                res(newObject);
            })
        } 

        let currentStorage: Array<SectionData> = [];
        let elementsToDraw: Array<SectionWidgetProps> = [];

        await AsyncStorage.getItem("Sections").then(data => {
            if (data !== null) {
                currentStorage = JSON.parse(data);
            }
        });

        for (const element of currentStorage) {
            await dataToAppend(element).then(data => {
                elementsToDraw.push(data);
            })
        }

        res(elementsToDraw);
    });
}

export const CreateSection = (sectionData: SectionData): Promise<boolean> => {
    return new Promise(async (res, rej) => {
        let currentStorage: Array<SectionData> = [];
        await AsyncStorage.getItem("Sections").then(data => {
            if (data !== null) {
                currentStorage = JSON.parse(data);
            }
        });

        const doesntExist = currentStorage.map((data: SectionData) => { return data.name }).indexOf(sectionData.name) === -1;

        if (doesntExist)
            currentStorage.push(sectionData);

        await AsyncStorage.setItem("Sections", JSON.stringify(currentStorage), (err) => {
            if (err) res(false);

            res(true);
        });
    });
}

export const RemoveSection = (sectionName: string): Promise<boolean> => {
    return new Promise(async (res, rej) => {
        await AsyncStorage.removeItem(`Section-${sectionName}`);

        let currentStorage: Array<SectionData> = [];
        await AsyncStorage.getItem("Sections").then(data => {
            if (data !== null) {
                currentStorage = JSON.parse(data);
            }
        });

        const index = currentStorage.map((data: SectionData) => { return data.name }).indexOf(sectionName);

        if (index !== -1) {
            currentStorage.splice(index, 1);

            await AsyncStorage.setItem("Sections", JSON.stringify(currentStorage));

            res(true);
        }

        res(false);
    });
}

export const GetTasks = (section: string): Promise<Array<TaskData>> => {
    return new Promise(async (res, rej) => {
        const sectionName = `Section-${section}`;
        let currentStorage: Array<TaskData> = [];

        await AsyncStorage.getItem(sectionName).then(data => {
            if (data !== null) {
                currentStorage = JSON.parse(data);
            }
        });
        
        res(currentStorage);
    });
} 

export const DeleteTask = (section: string, taskName: string): Promise<boolean> => {
    return new Promise(async (res, rej) => {
        const sectionName = `Section-${section}`;
        let currentStorage: Array<TaskData> = [];

        await AsyncStorage.getItem(sectionName).then(data => {
            if (data !== null) {
                currentStorage = JSON.parse(data);
            }
        });

        const itemIndex = currentStorage.map((data) => data.name).indexOf(taskName);

        if (itemIndex !== -1) {
            currentStorage.splice(itemIndex, 1);

            await AsyncStorage.setItem(sectionName, JSON.stringify(currentStorage));

            res(true);
        }

        res(false);
    });
}

export const SaveTask = (section: string, taskData: TaskData): Promise<boolean> => {
    return new Promise(async (res, rej) => {
        const sectionName = `Section-${section}`;

        let currentStorage: Array<TaskData> = [];
        await AsyncStorage.getItem(sectionName).then(data => {
            if (data !== null) {
                currentStorage = JSON.parse(data);
            }
        });

        const doesntExist = currentStorage.map((data: TaskData) => { return data.name }).indexOf(taskData.name) === -1;

        if (doesntExist) {
            currentStorage.push(taskData);

            await AsyncStorage.setItem(sectionName, JSON.stringify(currentStorage), (err) => {
                if (err) res(false);

                res(true);
            });
        }

        res(false);
    });
}

export const EndTask = (section: string, taskName: string, taskData: TaskData): Promise<boolean> => {
    return new Promise(async (res, rej) => {
        await DeleteTask(section, taskName).then(async success => {
            if (success) {
                let currentStorage: Array<TaskData> = [];

                await AsyncStorage.getItem('Ended-Tasks').then(data => {
                    if (data !== null) {
                        currentStorage = JSON.parse(data);
                    }
                });

                currentStorage.push(taskData);

                await AsyncStorage.setItem('Ended-Tasks', JSON.stringify(currentStorage));
            }

            res(success);
        });
    });
};

export const GetFinishedTasks = (): Promise<Array<TaskData>> => {
    return new Promise(async (res, rej) => {
        let currentStorage: Array<TaskData> = [];

        await AsyncStorage.getItem('Ended-Tasks').then(data => {
            if (data !== null) {
                currentStorage = JSON.parse(data);
            }
        });

        res(currentStorage);
    });
}

export const DeleteFinishedTask = (taskID: string): Promise<boolean> => {
    return new Promise(async (res, rej) => {
        await GetFinishedTasks().then(async data => {
            if (data !== null) {
                let currentStorage: Array<TaskData> = data;

                const elementIndex = currentStorage.map(data => { return data.taskID }).indexOf(taskID);

                if (elementIndex !== -1) {
                    currentStorage.splice(elementIndex, 1);

                    await AsyncStorage.setItem('Ended-Tasks', JSON.stringify(currentStorage), (err) => {
                        if (err) res(false);
    
                        res(true);
                    });
                }
            }
        });
    });
}

export const DeleteAllTasks = (): Promise<boolean> => {
    return new Promise(async (res, rej) => {
        await GetSections().then(async data => {
            if (data !== null) {
                for (const section of data) {
                    await AsyncStorage.removeItem(`Section-${section.name}`);
                }

                res(true);
            }
        });

        res(false);
    });
}

export const DeleteAllSections = (): Promise<boolean> => {
    return new Promise(async (res, rej) => {
        await DeleteAllTasks().then(async success => {
            if (success) {
                await AsyncStorage.removeItem("Sections");
            }

            res(success);
        })
    });
}

export const DeleteAllFinishedTasks = (): Promise<boolean> => {
    return new Promise(async (res, rej) => {
        await AsyncStorage.removeItem('Ended-Tasks', (err) => res(!err));
    });
}

export const SaveDarkModeState = (value: boolean): Promise<boolean> => {
    return new Promise(async (res, rej) => {
        await AsyncStorage.setItem('App-Darkmode', value ? 'true' : 'false', (err) => {
            res(!err);
        });
    });
}

export const LoadDarkModeState = (): Promise<boolean> => {
    return new Promise(async (res, rej) => {
        let returnData = false;

        await AsyncStorage.getItem('App-Darkmode').then(data => {
            returnData = data === 'false';
        });

        res(returnData);
    });
}