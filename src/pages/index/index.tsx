import { useState } from "react";
import { View } from "@tarojs/components";
import { useLoad } from "@tarojs/taro";
import CounterCard, { CounterCardInfo } from "@/components/CounterCard";
import "./index.scss";

/** 计数器个数选项 */
const counterNumberList = [1, 2, 3, 4, 5];

/** 计数器卡片背景色 */
const cardColors = ["#f2c2bf", "#f9ddbc", "#cfefc6", "#d2ddf9", "#d9ccf8"];

/** 计数器初始列表 */
const initCounterList: CounterCardInfo[] = [
  {
    username: "用户1",
    value: 0,
    backgroundColor: cardColors[0],
  },
];

export default function Index() {
  // 计数器数量
  const [counterNum, setCounterNum] = useState(1);

  // 计数器卡片信息
  const [counterCardInfoList, setCounterCardInfoList] =
    useState<CounterCardInfo[]>(initCounterList);

  // 改变计数器数量
  const handleChangeCounterNumber = (num: number) => {
    // 更新顶部选项的值
    setCounterNum(num);
    const newCounterCardInfoList = [...counterCardInfoList].slice(0, num);
    // 计数器数量变化量
    const delta = num - counterCardInfoList.length;
    if (delta > 0) {
      const newCardInfos: CounterCardInfo[] = [];
      for (let i = 0; i < delta; i++) {
        newCardInfos.push({
          username: `用户${counterCardInfoList.length + i + 1}`,
          value: 0,
          backgroundColor: cardColors[counterCardInfoList.length + i],
        });
      }
      setCounterCardInfoList([...counterCardInfoList, ...newCardInfos]);
    } else {
      setCounterCardInfoList(newCounterCardInfoList);
    }
  };

  // 减少
  const handleDecrease = (counterIndex: number) => {
    setCounterCardInfoList([
      ...counterCardInfoList.map((item, index) => {
        if (index === counterIndex) {
          return {
            ...item,
            value: item.value - 1,
          };
        } else {
          return item;
        }
      }),
    ]);
  };

  // 增加
  const handleIncrease = (counterIndex: number) => {
    setCounterCardInfoList([
      ...counterCardInfoList.map((item, index) => {
        if (index === counterIndex) {
          return {
            ...item,
            value: item.value + 1,
          };
        } else {
          return item;
        }
      }),
    ]);
  };

  // 重置单个数值
  const handleReset = (counterIndex: number) => {
    setCounterCardInfoList([
      ...counterCardInfoList.map((item, index) => {
        if (index === counterIndex) {
          return {
            ...item,
            value: 0,
          };
        } else {
          return item;
        }
      }),
    ]);
  };

  // 重置所有数值
  const handleResetAll = () => {
    setCounterCardInfoList([
      ...counterCardInfoList.map((item) => {
        return {
          ...item,
          value: 0,
        };
      }),
    ]);
  };

  useLoad(() => {
    console.log("Page loaded.");
  });

  return (
    <View className="index-container">
      <View className="index-header">
        {/* 计数器个数按钮 */}
        {counterNumberList.map((num) => {
          return (
            <View
              className={`index-count-num-btn ${
                counterNum === num ? "active" : ""
              }`}
              onClick={() => handleChangeCounterNumber(num)}
              key={num}
            >
              {num}
            </View>
          );
        })}
      </View>
      {/* 计数器卡片部分 */}
      <View className="index-main">
        {counterCardInfoList.map((cardInfo, index) => {
          return (
            <View className="counter-card-wrapper" key={index}>
              <CounterCard
                counterCardInfo={cardInfo}
                counterIndex={index}
                onDecrease={handleDecrease}
                onIncrease={handleIncrease}
                onReset={handleReset}
              />
            </View>
          );
        })}
      </View>
      {/* 全部重置按钮 */}
      <View className="reset-all-btn" onClick={handleResetAll}>
        全部重置
      </View>
    </View>
  );
}
