import React, { useState } from 'react';
import Constants from "expo-constants";
import { StyleSheet, Text, View, TextInput, GestureResponderEvent, TouchableHighlight } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import RequestManager from "../manager/Request";


interface LoginData {
    server: string;
    token: string;
    username: string;
    password: string;
}

export default function Login({ navigation, route: { params } }: { navigation: any, route: { params: { request: RequestManager } } }) {
    const [loading, setLoading] = useState<boolean>(false);

    function onSubmit(data: LoginData) {
        AsyncStorage.setItem("login-informations", JSON.stringify(data));

        return navigation.reset({
            index: 0,
            routes: [{ name: "main", params: { request: params.request } }]
        });
    }

    return (<View style={sheets.container}>
        {loading && <Spinner
            visible={loading}
            textContent={'Processing...'}
            textStyle={{ color: "white" }}
        />}
        <LoginForm onSubmit={onSubmit} request={params.request} setLoading={setLoading} />
    </View>)
}

function LoginForm({ onSubmit, request, setLoading }: { onSubmit: (data: LoginData) => void, request: RequestManager, setLoading: React.Dispatch<React.SetStateAction<boolean>> }) {
    const [server, setServer] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [invalid, setInvalid] = useState(false);
    const [errorMessage, setMessage] = useState("Invalid server.");

    async function onClick(responseData: GestureResponderEvent) {
        responseData.preventDefault();
        try {
            if (!server || !validateUrl(server)) return setInvalid(true);
            setLoading(true);
            const valid: boolean = await request.validate(server).catch(() => false);
            setLoading(false);
            if (!valid) return setInvalid(true);

            if (!username || !password) {
                setMessage("Invalid username or password.");
                return setInvalid(true);
            };
            setLoading(true);
            const { error, message, data }: { error: boolean, message: string, data: LoginResponse } = await request.login(server, username, password);
            setLoading(false);
            if (error) {
                setMessage(message);
                return setInvalid(true);
            }
            return onSubmit({ server, token: data.token ? data.token : "", username, password });
        } catch (e) {
            setInvalid(true);
            setLoading(false);
            setMessage(`Invalid server or credentials.`);
        }
    }

    function validateUrl(url: string) {
        const regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm;
        return regex.test(url);
    }

    return (
        <View style={sheets.form}>
            <Text style={{ fontSize: 40, textAlign: "center", color: "white" }}> Login </Text>
            <View style={{ backgroundColor: "white", borderRadius: 5, marginTop: 20, padding: 10 }}>
                <TextInput onChange={(e) => setServer(e.nativeEvent.text)}
                    placeholder="Your chibisafe instance. Ex: https://chibisafe.com" />
            </View>
            <View style={{ backgroundColor: "white", borderRadius: 5, marginTop: 20, padding: 10 }}>
                <TextInput onChange={(e) => setUsername(e.nativeEvent.text)}
                    placeholder="Username" />
            </View>
            <View style={{ backgroundColor: "white", borderRadius: 5, marginTop: 20, padding: 10 }}>
                <TextInput onChange={(e) => setPassword(e.nativeEvent.text)} secureTextEntry={true}
                    placeholder="Password" />
            </View>
            {invalid && <Text style={{ color: "red", textAlign: "center", marginTop: 10 }}>{errorMessage}</Text>}
            <TouchableHighlight onPress={onClick} style={{ backgroundColor: "green", marginTop: 30, height: 35, alignItems: "center", justifyContent: "center", borderRadius: 10 }}>
                <Text style={{ color: "white", fontSize: 17 }}>Submit</Text>
            </TouchableHighlight>
        </View>
    );
}

const sheets = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#16161d',
        alignItems: 'center',
        justifyContent: 'center',
    },
    form: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        width: "90%",
        borderRadius: 10,
        padding: 20
    }
});



interface User {
    id: number;
    username: string;
    isAdmin: boolean;
    apiKey: string;
}

interface LoginResponse {
    message?: string,
    user?: User,
    token?: string,
    apiKey?: string
}