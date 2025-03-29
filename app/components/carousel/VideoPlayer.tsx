import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

interface Props {
    url: string | undefined,
    activeItem?: string | undefined,
    isHomeTab: boolean
}

const VideoPlayer: React.FC<Props> = ({url, activeItem, isHomeTab}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);

    useEffect(() => {
        if (isHomeTab && activeItem === url) {
            setIsPlaying(true);
        } else {
            setIsPlaying(false);
        }
    }, [activeItem, url, isHomeTab]);

    return (
        <View style={styles.container}>
            <View style={styles.playerContainer}>
                <YoutubePlayer
                    height={218}
                    play={isPlaying}
                    videoId={url} // Extract video ID from URL
                    onChangeState={state => {
                        if (state === 'ended') {
                            setIsPlaying(false);
                        }
                    }}
                    mute={isMuted}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 218,  // Match the height we had before
    },
    playerContainer: {
        width: '100%',
        height: '100%',
        pointerEvents: 'box-none', // Disable touch events on the player container
    },
});

export default VideoPlayer;
