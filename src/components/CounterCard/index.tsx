import { useRef } from "react";
import Taro from "@tarojs/taro";
import { Icon, Input, Progress, View, Image } from "@tarojs/components";
import EdiSvg from "@/common/images/edit.svg";
import { hideConfirmModal, showConfirmModal } from "../ConfirmModal";
import "./index.scss";

export interface CounterCardInfo {
  /** 计数卡片用户名 */
  nickname: string;
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
  onEdit?: (newCounterCardInfo: CounterCardInfo, counterIndex: number) => void;
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
    onEdit,
  } = props;

  // 用于存储编辑的昵称
  const editNickname = useRef(counterCardInfo.nickname);

  // 用于存储编辑的数值
  const editValue = useRef(`${counterCardInfo.value}`);

  const handleEditNickname = () => {
    showConfirmModal({
      title: "备注昵称",
      content: (
        <Input
          type="text"
          placeholder="请输入备注昵称"
          defaultValue={editNickname.current}
          focus
          maxlength={15}
          onInput={(e) => {
            console.log(e.detail.value);
            // 将用户输入的值暂时存起来
            editNickname.current = e.detail.value;
          }}
        />
      ),
      onConfirm() {
        onEdit?.(
          { ...counterCardInfo, nickname: editNickname.current },
          counterIndex
        );
        hideConfirmModal();
      },
    });
  };

  const handleEditValue = () => {
    showConfirmModal({
      title: "修改数值",
      content: (
        <Input
          type="number"
          placeholder="请输入数值"
          defaultValue={`${editValue.current}`}
          focus
          maxlength={8}
          onInput={(e) => {
            // 将用户输入的值暂时存起来
            editValue.current = e.detail.value;
          }}
        />
      ),
      onConfirm() {
        onEdit?.(
          { ...counterCardInfo, value: Number(editValue.current) },
          counterIndex
        );
        hideConfirmModal();
      },
    });
  };

  const handleReset = () => {
    Taro.showModal({
      title: "提示",
      content: `确定重置${counterCardInfo.nickname}的数值吗？`,
      success: function (res) {
        if (res.confirm) {
          onReset?.(counterIndex);
        }
      },
    });
  };

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
        {counterCardInfo.nickname}
        <Image
          className="counter-card-edit-icon"
          src={EdiSvg}
          onClick={handleEditNickname}
        />
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
        <View className="counter-card-value" onClick={handleEditValue}>
          {counterCardInfo.value}
        </View>
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
        <View className="counter-card-reset" onClick={handleReset}>
          重置数值
        </View>
      </View>
    </View>
  );
}
