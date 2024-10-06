// import React, { useState, useCallback } from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import YoutubePlayer from 'react-native-youtube-iframe';
//
// const VideoPlayer: React.FC = () => {
//     const [playing, setPlaying] = useState<boolean>(true);
//
//     const onStateChange = useCallback((state: string) => {
//         // if (state === 'ended') {
//         //     setPlaying(false);
//         //     alert('Video has finished playing!');
//         // }
//     }, []);
//
//     console.log('VideoPlayer');
//
//     return (
//         <View style={styles.container}>
//             <YoutubePlayer
//                 height={100}
//                 play={playing}
//                 videoId={'HhesaQXLuRY'} // Replace with your YouTube video ID
//                 onChangeState={onStateChange}
//             />
//             {/*<Text style={styles.controlText} onPress={() => setPlaying((prev) => !prev)}>*/}
//             {/*    {playing ? 'Pause' : 'Play'}*/}
//             {/*</Text>*/}
//         </View>
//     );
// };
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         height: '100%',
//         width: '100%',
//         zIndex: 11111,
//     },
//     controlText: {
//         marginTop: 20,
//         fontSize: 18,
//         // color: 'blue',
//     },
// });
//
// export default VideoPlayer;

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const VideoPlayer: React.FC = () => {
    return (
        <View style={styles.container}>
            <WebView
                style={styles.webView}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                source={{ uri: 'https://www.youtube.com/embed/HhesaQXLuRY?autoplay=1&mute=0' }} // Replace with your YouTube video URL
                startInLoadingState={true}
                allowsInlineMediaPlayback={false}
                mediaPlaybackRequiresUserAction={false}
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
