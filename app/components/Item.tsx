import * as React from "react";
import {View, Text, StyleSheet} from "react-native";
import VideoPlayer from "@/app/components/VideoPlayer";
import { Post } from "@/app/types/Post";

interface Props {
    data: Post;
    activeItem?: string
}

const Item: React.FC<Props> = ({data, activeItem}) => {
    return (
        <View style={styles.container}>
            <VideoPlayer url={data.entity?.link} activeItem={activeItem}/>
            <View style={styles.contentContainer}>
                <Text style={styles.title}>{data.entity?.title}</Text>
                
                {/* Rating and Year */}
                <View style={styles.ratingContainer}>
                    <Text style={styles.rating}>⭐ {data.entity?.rating || 'N/A'}</Text>
                    <Text style={styles.year}>{data.entity?.year}</Text>
                </View>

                {/* Genre Tags */}
                <View style={styles.genreContainer}>
                    {data.entity?.genres?.map((genre, index) => (
                        <Text key={index} style={styles.genreTag}>{genre}</Text>
                    ))}
                </View>

                {/* Description */}
                <Text style={styles.description}>{data.entity?.overview}</Text>

                {/* Additional Info */}
                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>Duration: {data.entity?.duration}</Text>
                    {data.entity_type === 's' && (
                        <Text style={styles.infoText}>Seasons: {data.entity?.seasons}</Text>
                    )}
                    <Text style={styles.infoText}>Director: {data.entity?.director}</Text>
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
    contentContainer: {
        backgroundColor: '#1a1a1a',
        padding: 16,
        paddingTop: 0,
        paddingBottom: 0,
        flex: 1,
        height: '90%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    rating: {
        color: '#ffd700',
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
});

export default Item;