import { StyleSheet, Text, View, StatusBar, TouchableHighlight } from 'react-native';
import { NavigationContainer, RouteProp, ParamListBase } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CleanTabBar } from 'react-navigation-tabbar-collection';
import Icon from 'react-native-vector-icons/AntDesign';
import RequestManager from "../manager/Request";

import Upload from './sections/Upload';
import Uploads from './sections/Uploads';
import Albums from './sections/Albums';
import Settings from './sections/Settings';
import About from './sections/About';
import { useEffect } from 'react';

const DemoScreen = ({ route }: { route: RouteProp<ParamListBase, string> }) => (
    <View style={styles.screen}>
        <Text>{route.name} Henlo</Text>
    </View>
);

export default function Main({ navigation, route: { params } }: { navigation: any, route: { params: { request: RequestManager } } }) {
    const Tab = createBottomTabNavigator();

    useEffect(() => {
        StatusBar.setBarStyle("light-content");
    }, [])

    function logOut() {
        AsyncStorage.removeItem("login-informations").then(() => {
            const request = new RequestManager("", "");
            return navigation.reset({
                index: 0,
                routes: [{ name: "login", params: { request } }]
            })
        });
    }

    const SettingsScreen = ({ route }: { route: RouteProp<ParamListBase, string> }) => (
        <View style={styles.screen}>
            <TouchableHighlight onPress={logOut} style={{ backgroundColor: "red", marginTop: 30, height: 35, width: 100, alignItems: "center", justifyContent: "center", borderRadius: 10 }}>
                <Text style={{ color: "white", fontSize: 17 }}>Logout</Text>
            </TouchableHighlight>
        </View>
    );


    return (<View style={styles.container}>
        <NavigationContainer independent theme={{
            dark: true,
            colors: {
                background: "#1F2022",
                card: "#1F2022",
                text: "#FFFFFF",
                border: "#FFFFFF",
                notification: "#FFFFFF",
                primary: "#FFFFFF"

            }
        }}>
            <Tab.Navigator
                initialRouteName="Uploads"

                // @ts-ignore
                tabBar={(props) => <CleanTabBar {...props} darkMode={true} />}

            >
                <Tab.Screen
                    name="Upload"
                    children={() => <Upload request={params.request} logOut={logOut} />}

                    options={{
                        title: 'Upload',
                        tabBarIcon: ({ color, size }) => <Icon name="upload" size={size} color={color} />,
                        tabBarActiveTintColor: "success"
                    }}
                />
                <Tab.Screen
                    name="Uploads"
                    children={() => <Uploads request={params.request} logOut={logOut} />}
                    options={{
                        title: 'Uploads',
                        tabBarIcon: ({ color, size }) => <Icon name="home" size={size} color={color} />,
                        tabBarActiveTintColor: "info"
                    }}
                />
                <Tab.Screen
                    name="Albums"
                    children={() => <Albums request={params.request} logOut={logOut} />}
                    options={{
                        title: 'Albums',
                        tabBarIcon: ({ color, size }) => <Icon name="picture" size={size} color={color} />,
                        tabBarActiveTintColor: "info"
                    }}
                />
                <Tab.Screen
                    name="Settings"
                    children={() => <Settings request={params.request} logOut={logOut} />}
                    options={{
                        title: 'Settings',
                        tabBarIcon: ({ color, size }) => <Icon name="setting" size={size} color={color} />,
                        tabBarActiveTintColor: "danger"
                    }}
                />
                <Tab.Screen
                    name="About"
                    children={() => <About request={params.request} logOut={logOut} />}
                    options={{
                        title: 'About',
                        tabBarIcon: ({ color, size }) => <Icon name="info" size={size} color={color} />,
                        tabBarActiveTintColor: "info"
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    </View>)
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    screen: {
        width: '100%',
        height: '100%',
        flex: 6,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#16161d"
    }
});