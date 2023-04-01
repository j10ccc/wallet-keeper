import { View } from "@tarojs/components";
import styles from "./index.module.scss";
import DateExtension from "./DateExtension";
import PhotoExtension from "./PhotoExtension";
import VoiceExtension from "./VoiceExtension";


type PropsType = {
  record: React.RefObject<BillAPI.DraftType>
}

const ExtentsionListBar = (props: PropsType) => {

  return <View className={styles.container}>
    <DateExtension record={props.record}/>
    <PhotoExtension />
    <VoiceExtension originValue={props.record} />
  </View>;
};

export default ExtentsionListBar;
