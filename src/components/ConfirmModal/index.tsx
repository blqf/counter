import Taro from "@tarojs/taro";
import { ReactNode } from "react";
import { View } from "@tarojs/components";
import { render, unmountComponentAtNode } from "@tarojs/react";
import "./index.scss";

interface ConfirmModalProps {
  /** 标题 */
  title?: string;
  /** 主内容 */
  content?: ReactNode;
  visible?: boolean;
  onCancel?: () => void;
  onConfirm?: () => void;
}

const modalElement: any = document.createElement("view");

const ConfirmModal = (props: ConfirmModalProps) => {
  const { title = '提示', content, onCancel, onConfirm } = props;

  const handleCancel = () => {
    hideConfirmModal();
    onCancel?.();
  };

  return (
    <View className="mask">
      <View className="confirm-modal-container">
        <View className="confirm-modal-title">{title}</View>
        <View className="confirm-modal-content">{content}</View>
        <View className="confirm-modal-btn-wrapper">
          <View className="confirm-modal-cancel-btn" onClick={handleCancel}>
            取消
          </View>
          <View className="confirm-modal-submit-btn" onClick={onConfirm}>
            确定
          </View>
        </View>
      </View>
    </View>
  );
};

export const showConfirmModal = (props: ConfirmModalProps) => {
  const currentPages = Taro.getCurrentPages();
  const currentPage = currentPages[currentPages.length - 1]; // 获取当前页面对象
  const path = currentPage.$taroPath;
  const pageElement = document.getElementById(path);
  render(<ConfirmModal visible {...props} />, modalElement, () => {});
  pageElement?.appendChild(modalElement);
};

// 关闭对话框
export const hideConfirmModal = () => {
  const currentPages = Taro.getCurrentPages();
  const currentPage = currentPages[currentPages.length - 1];
  const path = currentPage.$taroPath;
  const pageElement = document.getElementById(path);
  unmountComponentAtNode(modalElement);
  pageElement?.removeChild(modalElement);
};
