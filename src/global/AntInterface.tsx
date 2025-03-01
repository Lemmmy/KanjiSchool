// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { App, message as originalMessage, notification as originalNotification, Modal as originalModal } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import type { ModalStaticFunctions } from "antd/es/modal/confirm";
import type { NotificationConfig, NotificationInstance } from "antd/es/notification/interface";
import { ConfigOptions } from "antd/es/message/interface";

type NotificationType = NotificationInstance & { config?: any };

// Use the default message and notification instances in case they are not yet initialized by App.tsx
let globalMessage: MessageInstance = originalMessage;
let globalNotification: NotificationType = originalNotification;
let globalModal: Omit<ModalStaticFunctions, "warn"> = originalModal;

export const notificationConfig: NotificationConfig = {
  placement: "topRight",
  top: 88 // Top nav height (64px) + default margin (24px)
};

export const messageConfig: ConfigOptions = {
  top: 4
};

export default function AntInterface(): JSX.Element | null {
  const staticFunction = App.useApp();
  globalMessage = staticFunction.message;
  globalModal = staticFunction.modal;
  globalNotification = staticFunction.notification;
  return null;
}

export function configureDefaultAntInterface(): void {
  originalNotification.config?.({
    ...notificationConfig,
    duration: 3
  });
  originalMessage.config(messageConfig);
}

export { globalMessage, globalModal, globalNotification };
