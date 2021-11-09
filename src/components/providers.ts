import { createContext } from "react";
import { ThemeProps } from "../types";

const lightTheme: ThemeProps = {
    background: '#FCFCFC',
    primary: '#448EF6',
    press: '#1b1b1b0a',
    font: '#464646',
    navigationText: '#fff'
}

const darkTheme: ThemeProps = {
    background: '#22272e',
    primary: '#1b1f24',
    press: '#1b1b1b0a',
    font: '#f2f2f2',
    navigationText: '#448EF6'
}

const ThemeContext = createContext({
    theme: lightTheme,
    change: () => {}
});

const SectionContext = createContext({
    currentSection: "",
    changeSection: (newSection: string) => {}
});

export { lightTheme, darkTheme, ThemeContext, SectionContext };