import { View } from "@tarojs/components";
import styles from "./index.module.scss";
import { DraftType } from "..";
import DateExtension from "./DateExtension";
import PhotoExtension from "./PhotoExtension";
import VoiceExtension from "./VoiceExtension";


type PropsType = {
  record: React.RefObject<DraftType>
}

const ExtentsionListBar = (props: PropsType) => {

  return <View className={styles.container}>
    <DateExtension record={props.record}/>
    <PhotoExtension />
    <VoiceExtension />
  </View>;
};

export default ExtentsionListBar;
