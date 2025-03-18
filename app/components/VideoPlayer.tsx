import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import YoutubePlayer from 'react-native-youtube-iframe';

interface Props {
    url: string,
    activeItem?: string | undefined
}

const VideoPlayer: React.FC<Props> = ({url, activeItem}) => {
    const [isPlaying, setIsPlaying] = useState(false);

    // Play video when it becomes active
    useEffect(() => {
        if (activeItem === url) {
            setIsPlaying(true);  // ✅ Start video
        } else {
            setIsPlaying(false); // ✅ Pause when out of view
        }
    }, [activeItem, url]);

    return (
        <View style={styles.container}>
            {/*<WebView*/}
            {/*    style={styles.webView}*/}
            {/*    javaScriptEnabled={true}*/}
            {/*    domStorageEnabled={true}*/}
            {/*    source={{ uri: url + "?autoplay=1&mute=0&playsinline=1&showinfo=0&controls=0&rel=0" }}*/}
            {/*    startInLoadingState={true}*/}
            {/*    allowsInlineMediaPlayback={false}*/}
            {/*    mediaPlaybackRequiresUserAction={false}*/}
            {/*/>*/}
            <YoutubePlayer
                height={300}
                play={isPlaying}
                videoId={url}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '50%',
    },
    webView: {
        flex: 1,
    },
});

export default VideoPlayer;
