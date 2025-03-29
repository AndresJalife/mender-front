import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import YoutubePlayer from 'react-native-youtube-iframe';

interface Props {
    url: string | undefined,
    activeItem?: string | undefined,
    isHomeTab: boolean
}

const VideoPlayer: React.FC<Props> = ({url, activeItem, isHomeTab}) => {
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        // Only play if we're on home tab AND this is the active item
        setIsPlaying(isHomeTab && activeItem === url);
    }, [activeItem, url, isHomeTab]);

    return (
        <View style={styles.container}>
            <YoutubePlayer
                height={218}
                play={isPlaying}
                videoId={url}
                initialPlayerParams={{
                    controls: false,
                    preventFullScreen: true,
                    modestbranding: true,
                }}
                webViewProps={{
                    androidLayerType: 'hardware',
                }}
                onReady={() => {
                    if (isHomeTab && activeItem === url) {
                        setIsPlaying(true);
                    }
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    webView: {
        flex: 1,
    },
});

export default VideoPlayer;
