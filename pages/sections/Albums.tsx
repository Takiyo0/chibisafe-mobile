import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Modal, Dimensions, Image, ScrollView, Pressable, TouchableHighlight } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import ImageViewer from 'react-native-image-zoom-viewer';
import RequestManager from "../../manager/Request";
import { Album } from "../../manager/Constants";


export default function Albums({ logOut, request }: { logOut: Function, request: RequestManager }) {
    const [albums, setAlbums] = useState<Album[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);
    const [currentAlbum, setCurrentAlbum] = useState<Album>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        request.getAlbums().then(albums => {
            if (albums.data.albums) setAlbums(albums.data.albums);
            setLoading(false);
        });
    }, []);

    function refresh() {
        setLoading(true);
        request.getAlbums().then(albums => {
            if (albums.data.albums) setAlbums(albums.data.albums);
            setLoading(false);
        });
    }

    function Loading() {
        return (<View style={sheets.loading}>
            <Feather name="loader" size={50} color="white" />
        </View>)
    }

    return (<View style={sheets.mainView}>

        {loading ? <Loading /> :
            <View>
                <ScrollView>
                    {albums.map((album, index) => {
                        return (<View key={index} style={sheets.album}>
                            <View style={sheets.albumHeader}>
                                <Text style={sheets.albumTitle}>{album.name}</Text>
                                <Text style={sheets.albumDate}>{new Date(album.createdAt).toDateString() + ", " + new Date(album.createdAt).toTimeString().substring(0, 5)}</Text>
                            </View>
                            <View style={sheets.albumContent}>
                                {album.files.map((image, index) => {
                                    return (<Pressable key={index} onPress={() => {
                                        setImageIndex(index);
                                        setCurrentAlbum(album);
                                        setModalVisible(true);
                                    }}>
                                        <Image source={{ uri: image.url.includes(".mp4") ? "https://i.imgur.com/ZJ12bEH.jpg" : image.thumbSquare }} style={sheets.albumImage} />
                                    </Pressable>);
                                })}
                            </View>
                        </View>);
                    })}
                </ScrollView>
                <Modal visible={modalVisible} transparent={true} onRequestClose={() => modalVisible ? setModalVisible(false) : null}>
                    <ImageViewer imageUrls={currentAlbum ? currentAlbum.files.map(image => ({ url: image.url })) : []} index={imageIndex} enableSwipeDown onSwipeDown={() => setModalVisible(false)} />
                </Modal>
            </View>}
        <TouchableHighlight underlayColor='transparent' style={sheets.refreshButton}><Ionicons name="refresh" color="white" size={30} onPress={refresh} /></TouchableHighlight>
    </View>)
}

const sheets = StyleSheet.create({
    mainView: {
        backgroundColor: "#16161d",
        height: "100%"
    },
    album: {
        margin: 10,
        borderRadius: 10,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    albumHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
    },
    albumTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white"
    },
    albumDate: {
        fontSize: 15,
        color: "#c9c9c9",
    },
    albumContent: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        padding: 10,
    },
    albumImage: {
        width: Dimensions.get("window").width / 3 - 20,
        height: Dimensions.get("window").width / 3 - 20,
        margin: 5,
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
});