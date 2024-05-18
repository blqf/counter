import { Icon, Progress, View } from "@tarojs/components";
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
  /** 是否展示删除按钮 */
  showDeleteBtn: boolean;
  /** 删除卡片的回调 */
  onDeleteCounterCard?: (counterIndex: number) => void;
  /** 减少按钮的回调 */
  onDecrease?: (counterIndex: number) => void;
  /** 增加按钮的回调 */
  onIncrease?: (counterIndex: number) => void;
  /** 重置按钮的回调 */
  onReset?: (counterIndex: number) => void;
}

// 连续增加的定时器
let increaceInterval: NodeJS.Timeout;

// 连续减少的定时器
let decreaceInterval: NodeJS.Timeout;

export default function CounterCard(props: CounterCardProps) {
  const {
    counterCardInfo,
    counterIndex,
    showDeleteBtn,
    onDeleteCounterCard,
    onDecrease,
    onIncrease,
    onReset,
  } = props;

  return (
    <View
      className="counter-card-container"
      style={{
        backgroundColor: counterCardInfo.backgroundColor,
      }}
    >
      {showDeleteBtn && (
        <Icon
          className="counter-card-delete-icon"
          size="18"
          type="clear"
          onClick={() => onDeleteCounterCard?.(counterIndex)}
        />
      )}
      <View className="counter-card-progress">
        <Progress
          percent={Math.max(counterCardInfo.value, 0)}
          strokeWidth={4}
        />
      </View>
      <View className="counter-card-item counter-card-first-item">
        {counterCardInfo.username}
      </View>
      <View className="counter-card-item">
        <View
          className="counter-card-decrease"
          onClick={() => onDecrease?.(counterIndex)}
          onLongPress={() => {
            decreaceInterval = setInterval(() => {
              onDecrease?.(counterIndex);
            }, 170);
          }}
          onTouchEnd={() => {
            clearInterval(decreaceInterval);
          }}
        >
          -
        </View>
        <View className="counter-card-value">{counterCardInfo.value}</View>
        <View
          className="counter-card-increase"
          onClick={() => onIncrease?.(counterIndex)}
          onLongPress={() => {
            increaceInterval = setInterval(() => {
              onIncrease?.(counterIndex);
            }, 170);
          }}
          onTouchEnd={() => {
            clearInterval(increaceInterval);
          }}
        >
          +
        </View>
      </View>
      <View className="counter-card-item counter-card-last-item">
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
