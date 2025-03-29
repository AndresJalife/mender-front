import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';

interface Props {
    url: string | undefined,
    activeItem?: string | undefined,
    isHomeTab: boolean
}

const VideoPlayer: React.FC<Props> = ({url, activeItem, isHomeTab}) => {
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        setIsPlaying(isHomeTab && activeItem === url);
    }, [activeItem, url, isHomeTab]);

    return (
        <View style={styles.container}>
            <WebView
                style={styles.webView}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                source={{ 
                    uri: "https://www.youtube.com/embed/" + url + "?autoplay=" + (isPlaying ? "1" : "0") + "&mute=0&playsinline=1&showinfo=0&controls=0&rel=0" 
                }}
                startInLoadingState={true}
                allowsInlineMediaPlayback={true}
                mediaPlaybackRequiresUserAction={false}
                allowsFullscreenVideo={false}
                allowsFullscreenVideoWithCustomVideoPlayer={false}
                allowsPictureInPictureMediaPlayback={false}
                allowsBackForwardNavigationGestures={false}
                setSupportMultipleWindows={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 218,  // Match the height we had before
    },
    webView: {
        width: '100%',
        height: '100%',
    },
});

export default VideoPlayer;
