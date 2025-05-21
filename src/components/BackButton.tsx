import React from "react";
import { Text, TouchableOpacity } from 'react-native';
import { gameScreenStyles } from "../styles/index";
import { useNavigation } from "@react-navigation/native";

type BackButtonProps = {
    textContent: string;
};

export const BackButton: React.FC<BackButtonProps> = ({ textContent }) => {

    const navigation = useNavigation();
    return (
        <TouchableOpacity style={[{
            position: 'absolute',
            top: 23,
            left: 16,
            width: 150,
            marginTop: 0,
            marginBottom: 10,
            backgroundColor: '#6BAED6',
            borderRadius: 10,
            zIndex: 1
        }]} onPress={() => navigation.replace('Lobby')}>
            <Text style={[gameScreenStyles.btnText, { color: 'white' }]}> ↩️ {textContent}</Text>
        </TouchableOpacity>
    );
};