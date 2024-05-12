import { View } from "@tarojs/components";
import "./index.scss";

export interface CounterCardInfo {
  /** 计数卡片用户名 */
  username: string;
  /** 计数卡片数值 */
  value: number;
  /** 计数卡片背景色 */
  backgroundColor: string;
}

interface CounterCardProps {
  /** 计数卡片信息 */
  counterCardInfo: CounterCardInfo;
  /** 卡片索引 */
  counterIndex: number;
  /** 减少按钮的回调 */
  onDecrease?: (counterIndex: number) => void;
  /** 增加按钮的回调 */
  onIncrease?: (counterIndex: number) => void;
  /** 重置按钮的回调 */
  onReset?: (counterIndex: number) => void;
}

export default function CounterCard(props: CounterCardProps) {
  const { counterCardInfo, counterIndex, onDecrease, onIncrease, onReset } =
    props;

  return (
    <View
      className="counter-card-container"
      style={{
        backgroundColor: counterCardInfo.backgroundColor,
      }}
    >
      <View className="counter-card-item">
        <View className="counter-card-username">
          {counterCardInfo.username}
        </View>
      </View>
      <View className="counter-card-item">
        <View
          className="counter-card-decrease"
          onClick={() => onDecrease?.(counterIndex)}
        >
          -
        </View>
        <View className="counter-card-value">{counterCardInfo.value}</View>
        <View
          className="counter-card-increase"
          onClick={() => onIncrease?.(counterIndex)}
        >
          +
        </View>
      </View>
      <View className="counter-card-item">
        <View
          className="counter-card-reset"
          onClick={() => onReset?.(counterIndex)}
        >
          重置
        </View>
      </View>
    </View>
  );
}
