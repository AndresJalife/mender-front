import * as React from "react";
import {View, Text, StyleSheet} from "react-native";
import VideoPlayer from "@/app/components/VideoPlayer";
import { Post } from "@/app/types/Post";

interface Props {
    data: Post;
    activeItem?: string;
    isHomeTab: boolean;
}

const CarouselItem: React.FC<Props> = ({data, activeItem, isHomeTab}) => {
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>{data.entity?.title}</Text>
                <Text style={styles.director}>{data.entity?.director}</Text>
                <View style={styles.headerDivider} />
            </View>
            <VideoPlayer 
                url={data.entity?.link} 
                activeItem={activeItem}
                isHomeTab={isHomeTab}
            />
            <View style={styles.videoDivider} />
            <View style={styles.contentContainer}>
                {/* Rating and Year */}
                <View style={styles.ratingContainer}>
                    <Text style={styles.rating}>☆ {data.entity?.rating || 'N/A'}</Text>
                    <Text style={styles.year}>{data.entity?.year}</Text>
                </View>

                {/* Genre Tags */}
                <View style={styles.genreContainer}>
                    {data.entity?.genres?.map((genre, index) => (
                        <Text key={index} style={styles.genreTag}>{genre}</Text>
                    ))}
                </View>
                <View style={styles.genreDivider} />

                {/* Description */}
                <Text style={styles.description}>{data.entity?.overview}</Text>

                {/* Additional Info */}
                <View style={styles.infoContainer}>
                    {/* <Text style={styles.infoText}>Duration: {data.entity?.duration}</Text>
                    {data.entity_type === 's' && (
                        <Text style={styles.infoText}>Seasons: {data.entity?.seasons}</Text>
                    )} */}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        flex: 1,
        backgroundColor: 'red',
    },
    headerContainer: {
        backgroundColor: '#1a1a1a',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 12,
    },
    contentContainer: {
        backgroundColor: '#1a1a1a',
        padding: 16,
        paddingTop: 16,
        paddingBottom: 0,
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 8,
        paddingRight: 30,
        marginRight: 15,
    },
    director: {
        color: '#888888',
        fontSize: 16,
        marginBottom: 4,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    rating: {
        color: '#ffffff',
        marginRight: 12,
        fontSize: 16,
    },
    year: {
        color: '#888888',
        fontSize: 16,
    },
    genreContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 12,
    },
    genreTag: {
        backgroundColor: '#333333',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
        color: '#ffffff',
    },
    description: {
        color: '#ffffff',
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 16,
    },
    infoContainer: {
        borderTopWidth: 1,
        borderTopColor: '#333333',
        paddingTop: 12,
    },
    infoText: {
        color: '#888888',
        fontSize: 14,
        marginBottom: 4,
    },
    headerDivider: {
        height: 1,
        backgroundColor: '#333333',
        marginTop: 12,
    },
    videoDivider: {
        height: 1,
        backgroundColor: '#333333',
    },
    genreDivider: {
        height: 1,
        backgroundColor: '#333333',
        marginBottom: 16,
    },
});

export default CarouselItem;