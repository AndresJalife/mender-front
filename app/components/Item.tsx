import * as React from "react";
import {View, Text} from "react-native";
import VideoPlayer from "@/app/components/VideoPlayer";

interface Props {
    data: {
        text: string;
        url: string;
    },
    activeItem?: string
}

const Item: React.FC<Props> = ({data, activeItem}) => {
    return (
        <View style={{height: "100%", width: "100%"}}>
            <VideoPlayer url={data.url} activeItem={activeItem}/>
            <Text style={{height: "10%"}}>{data.text}</Text>
        </View>
    );
};


export default Item;