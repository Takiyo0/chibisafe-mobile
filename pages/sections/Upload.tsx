import { useState } from "react";
import { StyleSheet, Text, View, Modal, Dimensions, Image, ScrollView, TouchableHighlight, ToastAndroid } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import RequestManager from "../../manager/Request";

type DownloadProgress = {
    [key: number]: number
}

interface File {
    path: string,
    headers: {
        "x-chunk-number": number,
        "x-chunk-total-number": number,
        "x-chunk-size": number,
        "x-file-name": string,
        "x-file-size": number,
        "x-file-identity": string
    },
    blob: {
        name: string,
        type: string,
        uri: string
    }
}

export default function Uploads({ logOut, request }: { logOut: Function, request: RequestManager }) {
    const [fileOpened, setFileOpened] = useState<boolean>(false);
    async function uploadButton() {
        setFileOpened(true);
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
            base64: true
        });
        setFileOpened(false);
        if (result.cancelled) return ToastAndroid.show("Upload cancelled", ToastAndroid.SHORT);
        const blob = await fetch(result.uri).then(x => x.blob()).catch(err => null);
        if (!blob) return ToastAndroid.show("Upload failed", ToastAndroid.SHORT);
        // const response = await request.uploadFile(result, blob).catch(e => ToastAndroid.show(e.message, ToastAndroid.SHORT));
    }

    return (
        <View style={styles.container}>
            {fileOpened && <Spinner
                visible={fileOpened}
                textContent={'File browser opened...'}
                textStyle={{ color: "white" }}
            />}
            <View style={styles.uploadForm}>
                <View style={styles.uploadFormHeader}>
                    <Text style={styles.uploadFormHeaderText}>Uploads</Text>
                </View>

                <TouchableHighlight style={styles.uploadFormHeaderButton}>
                    <Text style={styles.uploadFormHeaderButtonText}>Upload disabled</Text>
                </TouchableHighlight>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#16161d',
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadForm: {
        width: Dimensions.get('window').width,
        height: 500,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 10,
        padding: 20
    },
    uploadFormHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    uploadFormHeaderText: {
        fontSize: 20,
        color: 'white'
    },
    uploadFormHeaderButton: {
        width: '100%',
        height: 40,
        borderRadius: 10,
        backgroundColor: '#1a1a1a',
        justifyContent: 'center',
        alignItems: 'center'
    },
    uploadFormBody: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20
    },
    uploadFormHeaderButtonText: {
        fontSize: 20,
        color: 'white'
    },
});

    // async function getBase64(uri: string, file: ImagePickerResult): Promise<string> {
    //     return new Promise((resolve, reject) => {
    //         if (file.cancelled) throw new Error("Upload cancelled");
    //         let options = { encoding: ExpoFS.EncodingType.Base64 };
    //         ExpoFS.readAsStringAsync(uri, options).then(data => {
    //             const base64 = `data:${file.type}/${file.uri.match(/\.[0-9a-z]+$/i)![0].replace(/./gi, "")};base64` + data;
    //             resolve(base64); // are you sure you want to resolve the data and not the base64 string? 
    //         }).catch(err => {
    //             console.log("​getFile -> err", err);
    //             reject(err);
    //         });
    //     });
    // }


        // async function getBlob(uri: string): Promise<Blob> {
    //     // Why are we using XMLHttpRequest? See:
    //     // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    //     return new Promise((resolve, reject) => {
    //         const xhr = new XMLHttpRequest();
    //         xhr.onload = function () {
    //             resolve(xhr.response);
    //         };
    //         xhr.onerror = function (e) {
    //             console.log(e);
    //             reject(new TypeError("Network request failed"));
    //         };
    //         xhr.responseType = "blob";
    //         xhr.open("GET", uri, true);
    //         xhr.send(null);
    //     });
    // }
