import * as React from 'react';
import {Dimensions, StyleSheet, Text, View, LogBox} from 'react-native';
import CarouselComp from 'react-native-reanimated-carousel';
import CarouselItem from './CarouselItem'; 
import {useCallback, useState, useEffect, useRef} from "react";
import { Post } from "@/app/types/Post";

interface IndexProps {
    items: Post[];
    currentTab: string;
    onLoadMore: () => void;
}

LogBox.ignoreLogs(['[react-native-reanimated]']);

const Carousel: React.FC<IndexProps> = ({items, currentTab, onLoadMore}) => {
    const [activeItem, setActiveItem] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const firstRender = useRef(true);

    const onNext = useCallback((index: number) => {
        'worklet';
        requestAnimationFrame(() => {
            setActiveItem(items[index]?.entity?.trailer ?? "");
            setCurrentIndex(index);
        });
    }, [items]);

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }

        const remaining = items.length - 1 - currentIndex;

        if (remaining <= 3 && !isLoadingMore) {
            setIsLoadingMore(true);
            onLoadMore();
            setTimeout(() => setIsLoadingMore(false), 1000);
        }
    }, [currentIndex, items.length]);


    return (
        <View style={styles.carouselContainer}>
            <CarouselComp
                width={Dimensions.get('window').width}
                autoPlay={false}
                height={Dimensions.get('window').height - 80}
                vertical={true}
                onSnapToItem={onNext}
                data={items}
                windowSize={5}
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
