import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Modal, Dimensions, Image, ScrollView, Pressable, TouchableHighlight, ToastAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import ImageViewer from 'react-native-image-zoom-viewer';
import RequestManager from "../../manager/Request";
import * as ExpoFS from 'expo-file-system';

type DownloadProgress = {
    [key: number]: number
}

export default function Uploads({ logOut, request }: { logOut: Function, request: RequestManager }) {
    const [files, setFiles] = useState<File[]>([]);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [downloadProgress, setDownloadProgress] = useState<DownloadProgress>({});
    const [imageIndex, setImageIndex] = useState<number>(0);
    const [visible, setIsVisible] = useState<boolean>(false);

    useEffect(() => {
        collectUploads(page);
    }, [page]);

    async function collectUploads(currentPage: number) {
        const uploads = await request.getFiles(false, 50, currentPage);
        setFiles([]);
        if (!uploads || !uploads.data || !uploads.data.files) return logOut();
        setTotalPage(chunkArray(new Array(uploads.data.count).fill(() => true), 50).length);
        setFiles(uploads.data.files);
        setIsLoading(false);
    }

    async function refresh() {
        setIsLoading(true);
        setFiles([]);
        setPage(1);
        collectUploads(1);
    }

    function arrayMover(array: File[], target: number) {
        return Array.from(array, (_, index) => array[(index + target) % array.length])
    }

    function handleImageClick(index: number) {
        setImageIndex(index);
        setIsVisible(true)
    }

    function handleImage(image: File, index: number) {
        return <TouchableHighlight onPress={() => handleImageClick(index)}><Image key={index} style={{ height: 80, aspectRatio: 1 / 1, margin: 5 }} source={{ uri: image.thumbSquare }}></Image></TouchableHighlight>
    }

    function chunkArray(array: Array<boolean>[], chunkSize: number) {
        let results = [];
        while (array.length) {
            results.push(array.splice(0, chunkSize));
        }
        return results;
    }

    function handleButton(type: string) {
        setIsLoading(true);
        if (type === "left") {
            if (page > 1) setPage(page - 1);
        } else {
            if (page < totalPage) setPage(page + 1);
        }
    }

    function Loading() {
        return (<View style={sheets.loading}>
            <Feather name="loader" size={50} color="white" />
        </View>)
    }

    function downloadCallback(downloadProgress: { totalBytesWritten: number, totalBytesExpectedToWrite: number }, fileId: number) {
        const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
        setDownloadProgress({ ...downloadProgress, [fileId]: progress });
    }

    async function checkDirectory(): Promise<boolean> {
        if (!ExpoFS.documentDirectory) {
            ToastAndroid.show("Error: No directory found. Permission problem?", ToastAndroid.SHORT);
            return false;
        };
        const files = await ExpoFS.readDirectoryAsync(ExpoFS.documentDirectory + '/').catch(_ => [""]);
        if (!files.includes("chibisafe")) await ExpoFS.makeDirectoryAsync(ExpoFS.documentDirectory + "/chibisafe/");
        return true;
    }

    async function handleDownload(file: File) {
        const valid = await checkDirectory().catch(_ => false);
        if (!valid) return ToastAndroid.show("Error: Internal error.", ToastAndroid.SHORT);
        const downloadResumable = ExpoFS.createDownloadResumable(
            file.url,
            ExpoFS.documentDirectory + '/chibisafe/' + `${file.original}`,
            {},
            (data) => downloadCallback(data, file.id)
        );
        await downloadResumable.downloadAsync();
        setDownloadProgress({ ...downloadProgress, [file.id]: 0 });
        ToastAndroid.show(`Downloaded ${file.original} to ${ExpoFS.documentDirectory + '/chibisafe/' + `${file.original}`}`, ToastAndroid.LONG);
    }

    return (<View style={{ backgroundColor: "#16161d", height: "auto", maxHeight: Dimensions.get("window").height, flex: 1 }}>
        <View style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", paddingLeft: 20, paddingRight: 20, marginTop: 15, marginBottom: 10 }}>
            <Icon name="left" color="white" size={20} onPress={() => handleButton("left")} />
            <Text style={{ color: "white" }}>Page {page} of {totalPage}</Text>
            <Icon name="right" color="white" size={20} onPress={() => handleButton("right")} />
        </View>
        {visible && <Modal visible={visible} transparent={true} onRequestClose={() => visible ? setIsVisible(false) : null}>
            <ImageViewer
                imageUrls={files.map(x => ({ url: x.url }))}
                index={imageIndex}
                enableSwipeDown={true}
                enablePreload={true}
                onCancel={() => setIsVisible(false)}
                renderFooter={(index: number) => <View style={sheets.viewerFooter}>
                    <View style={sheets.firstFooter}>
                        <Icon name="download" color="white" size={25} onPress={() => handleDownload(files[index])} />
                        <Text style={sheets.footerText}>{files[index].original}</Text>
                        <Icon name="arrowleft" color="white" size={25} onPress={() => setIsVisible(false)} />
                    </View>
                    <View>
                        {/* {(() => {
                            console.log(downloadProgress[filesToShow[index].id]);
                            return downloadProgress[filesToShow[index].id] &&
                                downloadProgress[filesToShow[index].id] !== 0 &&
                                <Progress.Bar progress={downloadProgress[filesToShow[index].id]} color="#16161d" unfilledColor="white" borderColor="white" borderWidth={1} style={{ marginTop: 10 }} />
                        })()} */}
                    </View>
                </View>}
            />
        </Modal>}

        {isLoading ? <Loading /> :
            <ScrollView style={sheets.scrollView} contentContainerStyle={{ flexGrow: 1 }}>
                <View style={sheets.images}>
                    {files.length ? files.map((file, index) => <Pressable key={index}>{handleImage(file, index)}</Pressable>) : <Text>No files</Text>}
                </View>
            </ScrollView>}

        <TouchableHighlight underlayColor='transparent' style={sheets.refreshButton}><Ionicons name="refresh" color="white" size={30} onPress={refresh} /></TouchableHighlight>
    </View>)
}

const sheets = StyleSheet.create({
    viewerFooter: {
        width: Dimensions.get("window").width,
        backgroundColor: "rgba(255, 255, 255, .1)",
        paddingBottom: 20,
        paddingTop: 10,
        paddingLeft: 15,
        paddingRight: 15,
    },
    firstFooter: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    footerText: {
        color: "white",
        textAlign: "center"
    },
    scrollView: {
        display: 'flex',
        flexWrap: 'nowrap',
        width: '100%',
        height: "auto"
    },
    images: {
        display: "flex",
        width: Dimensions.get('window').width,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around"
    },
    refreshButton: {
        position: "absolute",
        backgroundColor: "#2f363d",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        height: 40,
        width: 40,
        bottom: 10,
        right: 10
    },
    loading: {
        justifyContent: "center",
        alignItems: "center",
        height: Dimensions.get('window').height - 150
    }
})

interface File {
    id: number;
    userId: number;
    name: string;
    original: string;
    type: string;
    size: number;
    hash: string;
    ip: string;
    createdAt: number;
    editedAt: number;
    url: string;
    thumb: string;
    thumbSquare: string;
}