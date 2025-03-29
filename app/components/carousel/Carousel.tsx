import * as React from 'react';
import {Dimensions, StyleSheet, Text, View, LogBox} from 'react-native';
import CarouselComp from 'react-native-reanimated-carousel';
import CarouselItem from './CarouselItem'; // Updated import path
import {useCallback, useState} from "react"; // Removed unused imports
import { Post } from "@/app/types/Post";

interface IndexProps {
    items: Post[];
    currentTab: string; 
}

LogBox.ignoreLogs(['[react-native-reanimated]']);

const Carousel: React.FC<IndexProps> = ({items, currentTab}) => {
    const [activeItem, setActiveItem] = useState("");

    const onNext = useCallback((index: number) => {
        'worklet';
        requestAnimationFrame(() => {
            setActiveItem(items[index]?.entity?.link ?? "");
        });
    }, [items]);

    return (
        <View style={styles.carouselContainer} pointerEvents="box-none">
            <CarouselComp
                width={Dimensions.get('window').width}
                autoPlay={false}
                height={Dimensions.get('window').height - 80}
                vertical={true}
                onSnapToItem={onNext}
                data={items}
                renderItem={({ index }: { index: number }) => (
                    <CarouselItem 
                        data={items[index]} 
                        activeItem={activeItem}
                        isHomeTab={currentTab === 'home'} 
                    />
                )}
                defaultIndex={0}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    carouselContainer: {
        flex: 1,
        zIndex: 1
    },
});

export default Carousel;
