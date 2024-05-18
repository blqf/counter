import { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import CounterCard, { CounterCardInfo } from "@/components/CounterCard";
import { STORAGE_KEY_COUNTER_INFO_LIST } from "@/common/constant";
import ResetSvg from "@/common/images/reset.svg";
import "./index.scss";

/** 计数器个数选项 */
const counterNumberList = [1, 2, 3, 4, 5];

/** 计数器卡片背景色 */
const cardColors = ["#f2c2bf", "#f9ddbc", "#cfefc6", "#d2ddf9", "#d9ccf8"];

/** 缓存里的计数器初始列表 */
const counterInfoListStorage = Taro.getStorageSync(
  STORAGE_KEY_COUNTER_INFO_LIST
);
// 自定义的初始列表
const initCounterList = [
  {
    username: "用户1",
    value: 0,
    backgroundColor: cardColors[0],
  },
];
// 最终的列表，优先使用缓存
const realInitCounterList: CounterCardInfo[] =
  counterInfoListStorage || initCounterList;

export default function Index() {
  // 计数器数量
  const [counterNum, setCounterNum] = useState(realInitCounterList.length);

  // 计数器卡片信息
  const [counterCardInfoList, setCounterCardInfoList] =
    useState<CounterCardInfo[]>(realInitCounterList);

  // 改变计数器数量
  const handleChangeCounterNumber = (num: number) => {
    // 更新顶部选项的值
    setCounterNum(num);

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
      setCounterCardInfoList([...counterCardInfoList].slice(0, num));
    }
  };

  // 重置所有计数器信息
  const handleResetAllInfo = () => {
    Taro.showModal({
      title: "提示",
      content: "此操作会清除所有记录，并回到初始状态！",
      success: function (res) {
        if (res.confirm) {
          // 重置计数器数量数值
          setCounterNum(1);
          // 重置计数器卡片数量
          setCounterCardInfoList(initCounterList);
        }
      },
    });
  };

  // 删除卡片
  const handleDeleteCard = (deleteIndex: number) => {
    Taro.showModal({
      title: "提示",
      content: `确定删除“${counterCardInfoList[deleteIndex].username}”这个计数卡片吗？`,
      success: function (res) {
        if (res.confirm) {
          // 更新顶部选项的值
          setCounterNum(counterNum - 1);
          // 计数器卡片变化
          setCounterCardInfoList(
            counterCardInfoList.filter((_info, index) => {
              return index !== deleteIndex;
            })
          );
        }
      },
    });
  };

  // 减少
  const handleDecrease = (counterIndex: number) => {
    // 这里写成回调的形式，是因为长按连续增加功能使用了setInterval，会形成闭包
    // 参考：https://taro-docs.jd.com/blog/2019-07-10-taro-hooks#useeffect-%E4%B8%8E%E5%89%AF%E4%BD%9C%E7%94%A8
    setCounterCardInfoList((infoList) => [
      ...infoList.map((item, index) => {
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
    // 这里写成回调的形式，是因为长按连续增加功能使用了setInterval，会形成闭包
    // 参考：https://taro-docs.jd.com/blog/2019-07-10-taro-hooks#useeffect-%E4%B8%8E%E5%89%AF%E4%BD%9C%E7%94%A8
    setCounterCardInfoList((infoList) => [
      ...infoList.map((item, index) => {
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
  const handleResetAllData = () => {
    Taro.showModal({
      title: "提示",
      content: "确定重置全部数值吗？",
      success: function (res) {
        if (res.confirm) {
          setCounterCardInfoList([
            ...counterCardInfoList.map((item) => {
              return {
                ...item,
                value: 0,
              };
            }),
          ]);
        }
      },
    });
  };

  // 当计数器信息变化的时候，更新缓存
  useEffect(() => {
    Taro.setStorage({
      key: STORAGE_KEY_COUNTER_INFO_LIST,
      data: counterCardInfoList,
    });
  }, [counterCardInfoList]);

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
        <Image
          className="index-reset-all-info-btn"
          src={ResetSvg}
          onClick={handleResetAllInfo}
        />
      </View>
      {/* 计数器卡片部分 */}
      <View className="index-main">
        {counterCardInfoList.map((cardInfo, index) => {
          return (
            <View className="counter-card-wrapper" key={index}>
              <CounterCard
                counterCardInfo={cardInfo}
                counterIndex={index}
                showDeleteBtn={counterCardInfoList.length > 1}
                onDecrease={handleDecrease}
                onIncrease={handleIncrease}
                onReset={handleReset}
                onDeleteCounterCard={handleDeleteCard}
              />
            </View>
          );
        })}
      </View>
      {/* 重置全部数值按钮 */}
      <View className="index-reset-all-btn" onClick={handleResetAllData}>
        重置全部数值
      </View>
    </View>
  );
}
