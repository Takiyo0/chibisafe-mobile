import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import RequestManager from "../../manager/Request";
import Hyperlink from 'react-native-hyperlink';


export default function About({ logOut, request }: { logOut: Function, request: RequestManager }) {
    return (<View style={sheets.mainView}>
        <ScrollView style={sheets.scrollView}>
            <View style={sheets.section}>
                <Text style={sheets.sectionTitle}>ChibiSafe</Text>
                <Image source={require("../../assets/adaptive-icon.png")} style={sheets.sectionImage} />
                <Hyperlink linkStyle={{ color: '#66adff', fontSize: 15 }}
                    linkText={url => url === 'https://github.com/WeebDev' ? 'WeebDev' : url} onPress={(url => alert(url))} >
                    <Text style={sheets.developer}>Developed by https://github.com/WeebDev</Text>
                </Hyperlink>


                <Hyperlink linkStyle={{ color: '#66adff', fontSize: 15 }}
                    linkText={url => url === 'https://github.com/WeebDev/chibisafe' ? 'open source' : url} onPress={(url => alert(url))} >
                    <Text style={sheets.description}>ChibiSafe is an https://github.com/WeebDev/chibisafe file uploader service written in node that aims to to be easy to use and easy to set up. It's mainly intended for images and videos, but it accepts anything you throw at it.
                    </Text>
                </Hyperlink>
            </View>


            <View style={sheets.section}>
                <Text style={sheets.sectionTitle}>ChibiSafe Mobile App</Text>
                <Image source={require("../../assets/takiyo.png")} style={sheets.sectionTakiyoImage} />
                <Hyperlink linkStyle={{ color: '#66adff', fontSize: 15 }}
                    linkText={url => url === 'https://github.com/Takiyo0' ? 'Takiyo' : url} onPress={(url => alert(url))} >
                    <Text style={sheets.developer}>Developed by https://github.com/Takiyo0</Text>
                </Hyperlink>


                <Hyperlink linkStyle={{ color: '#66adff', fontSize: 15 }}
                    linkText={url => url === 'https://github.com/Takiyo0/chibisafe-android' ? 'open source' : url} onPress={(url => alert(url))} >
                    <Text style={sheets.description}>ChibiSafe Mobile app is an https://github.com/Takiyo0/chibisafe-android mobile client (android only atm, iOS maybe soon idk) for ChibiSafe. Easy to use (i hope) and easy to set up. You can view images and albums by sliding it, and download directly with one button.</Text>
                </Hyperlink>
            </View>


            <View style={sheets.section}>
                <Text style={sheets.sectionTitle}>License</Text>

                <Text style={sheets.description}>
                    MIT License

                    Copyright (c) 2022 Takiyo

                    Permission is hereby granted, free of charge, to any person obtaining a copy
                    of this software and associated documentation files (the "Software"), to deal
                    in the Software without restriction, including without limitation the rights
                    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                    copies of the Software, and to permit persons to whom the Software is
                    furnished to do so, subject to the following conditions:

                    The above copyright notice and this permission notice shall be included in all
                    copies or substantial portions of the Software.

                    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                    SOFTWARE.
                </Text>

            </View>

            <Text style={{ color: "white", textAlign: "center", marginBottom: 20 }}>© 2022 Takiyo &#38; WeebDev. All rights reserved.</Text>
        </ScrollView>
    </View>)
}

const sheets = StyleSheet.create({
    mainView: {
        backgroundColor: "#16161d",
        paddingTop: 20
    },
    scrollView: {
        paddingLeft: 20,
        paddingRight: 20
    },
    section: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.1)",
        padding: 10,
        borderRadius: 10,
        marginBottom: 20
    },
    sectionTitle: {
        color: "white",
        fontSize: 18
    },
    sectionImage: {
        width: 200,
        height: 200
    },
    sectionTakiyoImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginTop: 20,
        marginBottom: 10
    },
    developer: {
        color: "white",
        fontSize: 15
    },
    description: {
        color: "white",
        fontSize: 15,
        marginTop: 20
    }
});