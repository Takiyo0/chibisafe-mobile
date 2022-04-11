import { useEffect } from "react";
import { StyleSheet, Text, View, Animated, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import RequestManager from "../manager/Request";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface LoginData {
    server: string;
    token: string;
    username: string;
    password: string;
}

export default function Home({ navigation }: { navigation: any }) {

    useEffect(() => {
        setTimeout(async () => {
            let loginInformation: string | null = await AsyncStorage.getItem("login-informations");
            let parsedLoginInformation: LoginData | null = loginInformation ? JSON.parse(loginInformation) : null;

            const request = parsedLoginInformation ? new RequestManager(parsedLoginInformation.token, parsedLoginInformation.server) : new RequestManager("", "");

            return navigation.reset({ index: 0, routes: [{ name: parsedLoginInformation ? "main" : "login", params: { request } }] });
        }, 1500)
    }, [])

    return (<View style={styles.container}>
        <AnimatedLinearGradient colors={["#034694", "#1F75FE"]} style={styles.background}>
            <Text style={{ color: "white" }}>Please wait while we are loading...</Text>
        </AnimatedLinearGradient>
    </View>)
}

const styles = StyleSheet.create({
    container: {
        paddingTop: Constants.statusBarHeight,
        flex: 1
    },
    background: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
