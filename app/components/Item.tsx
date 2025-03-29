import * as React from "react";
import {View, Text} from "react-native";
import VideoPlayer from "@/app/components/VideoPlayer";
import { Post } from "@/app/types/Post";

interface Props {
    data: Post;
    activeItem?: string
}

const Item: React.FC<Props> = ({data, activeItem}) => {
    return (
        <View style={{height: "100%", width: "100%"}}>
            <VideoPlayer url={data.entity?.link} activeItem={activeItem}/>
            <Text style={{height: "10%"}}>{data.entity?.title}</Text>
        </View>
    );
};


export default Item;