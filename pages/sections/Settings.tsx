import { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableHighlight } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import RequestManager from "../../manager/Request";
import { User, ChangePasswordData } from "../../manager/Constants";


export default function Settings({ logOut, request }: { logOut: Function, request: RequestManager }) {
    const [user, setUser] = useState<User>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        request.getUser().then(user => {
            if (user.data.user) setUser(user.data.user);
            setLoading(false);
        });
    }, []);

    function handleChangePassword(changeData: ChangePasswordData) {
        setLoading(true);
        request.changePassword(changeData.oldPassword, changeData.newPassword).then(({ error, data }) => {
            setLoading(false);
            if (error) return changeData.giveError(data.message);
            setTimeout(() => logOut(), 500);
        });
    }

    return (<View style={styles.screen}>
        {loading && <Spinner
            visible={loading}
            textContent={'Loading...'}
            textStyle={{ color: "white" }}
        />}
        <ScrollView>
            <View style={styles.user}>
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>Username: {user?.username}</Text>
                    <Text style={styles.userId}>ID: {user?.id}</Text>
                </View>
                <ChangePasswordForm onChange={handleChangePassword} />
            </View>
            <TouchableHighlight onPress={() => logOut()} style={styles.logout}>
                <Text style={{ color: "white", fontSize: 17 }}>Logout</Text>
            </TouchableHighlight>
        </ScrollView>
    </View>)
}

function ChangePasswordForm({ onChange }: { onChange: (data: ChangePasswordData) => void }) {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    function onSubmit() {
        if (!oldPassword || !newPassword || !confirmPassword) return giveError("Please fill all fields");
        if (newPassword !== confirmPassword) return giveError("New password and confirm password do not match");
        if (newPassword === oldPassword) return giveError("New password cannot be the same as the old password");
        if (newPassword.length < 5) return giveError("New password must be at least 5 characters long");

        onChange({ oldPassword, newPassword, giveError });
    }

    function giveError(message: string) {
        setError(true);
        setErrorMessage(message);
    }

    return (<View style={styles.changePasswordForm}>
        <Text style={{ fontSize: 20, color: "white" }}>Change Password</Text>
        <TextInput placeholder="Old Password" placeholderTextColor="white" style={styles.input} onChange={e => setOldPassword(e.nativeEvent.text)} />
        <TextInput placeholder="New Password" placeholderTextColor="white" style={styles.input} onChange={e => setNewPassword(e.nativeEvent.text)} />
        <TextInput placeholder="Confirm Password" placeholderTextColor="white" style={styles.input} onChange={e => setConfirmPassword(e.nativeEvent.text)} />
        {error && <Text style={styles.error}>{errorMessage}</Text>}
        <TouchableHighlight style={styles.button} onPress={onSubmit}>
            <Text style={{ color: "white", fontSize: 17 }}>Change Password</Text>
        </TouchableHighlight>
    </View>)
}

const styles = StyleSheet.create({
    changePasswordForm: {
        marginTop: 10,
        marginBottom: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        borderRadius: 5,
        borderColor: "white",
        borderWidth: 1,
        padding: 10,
        width: "100%"
    },
    input: {
        borderColor: "white",
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 10,
        marginBottom: 10,
        padding: 10,
        width: "100%",
        color: "white"
    },
    error: {
        color: "red",
        fontSize: 15,
        marginTop: 10,
        marginBottom: 10,
        width: "100%",
        textAlign: "center"
    },
    button: {
        marginTop: 10,
        marginBottom: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#265473",
        borderRadius: 5,
        padding: 10,
        width: "100%"
    },
    screen: {
        backgroundColor: "#16161d",
        width: "100%",
        flex: 1,
        padding: 20
    },
    user: {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        padding: 20,
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
        marginTop: 10,
        marginBottom: 10
    },
    userName: {
        color: "white",
        fontSize: 20
    },
    userId: {
        color: "white",
        fontSize: 15
    },
    logout: {
        backgroundColor: "red",
        padding: 20,
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        justifyContent: "center",
        alignItems: "center"
    }
});