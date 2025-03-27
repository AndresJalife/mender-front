import * as React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import CarouselComp from 'react-native-reanimated-carousel';
import Item from "@/app/components/Item";
import {useState} from "react";

interface IndexProps {
    items: any[];
}

const Carousel: React.FC<IndexProps> = ({items}) => {

    const [activeItem, setActiveItem] = useState("");

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
        zIndex: 1
    },
});

export default Carousel;
