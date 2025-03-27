import * as React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import CarouselComp from 'react-native-reanimated-carousel';
import VideoPlayer from "@/app/components/VideoPlayer";
import Item from "@/app/components/Item";
import {useEffect, useState} from "react";

interface IndexProps {
    items: any[]; // You can replace 'any' with a more specific type depending on your item structure
}

const Carousel: React.FC<IndexProps> = ({items}) => {


    const [activeItem, setActiveItem] = useState("");

    // Update activeItem when scrolling
    const onNext = (index: number) => {
        requestAnimationFrame(() => {
            setActiveItem(items[index]?.url ?? "");
        });
    };

    return (
        <View style={styles.carouselContainer} pointerEvents="box-none">
            <CarouselComp
                width={Dimensions.get('window').width}
                autoPlay={false}
                height={Dimensions.get('window').height - 150}
                style={{ backgroundColor: 'black', marginBottom: '10%' }}
                vertical={true}
                onSnapToItem={onNext}
                data={items}
                renderItem={({ index }: { index: number }) => (
                    <Item data={items[index]} activeItem={activeItem} />
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    carouselContainer: {
        flex: 1, // ✅ Makes Carousel take full height
        // marginBottom: 56, // ✅ Ensures Carousel does not overlap Bottom Navigation
        zIndex: 1
    },
});

export default Carousel;
