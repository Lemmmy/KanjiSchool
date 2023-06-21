// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Button, Modal } from "antd";
import { LogoutOutlined } from "@ant-design/icons";

import { logOut } from "@api";

export function LogOutButton(): JSX.Element {
  return <Button
    type="primary"
    danger
    icon={<LogoutOutlined />}
    onClick={logOutModal}
  >
    Log out
  </Button>;
}

function logOutModal() {
  const modal = Modal.confirm({
    title: "Log out",
    icon: <LogoutOutlined />,
    content: <>
      <p>
        Are you sure you want to log out? The following data will be cleared
        from your browser:
      </p>

      <ul>
        <li>Cached assignments</li>
        <li>Cached reviews</li>
        <li>Cached review statistics</li>
        <li>Cached level progressions</li>
        <li>Cached study materials</li>
        <li>Cached user data</li>
        <li>Pending submission queue</li>
        <li>Any ongoing session</li>
      </ul>

      <p>The following data will <b>NOT</b> be cleared from your browser:</p>

      <ul>
        <li>Cached subjects</li>
        <li>Cached audio</li>
        <li>Cached radical images</li>
        <li>Settings</li>
      </ul>

      <p>Any unsubmitted data will be lost.</p>
    </>,
    okText: "Log out",
    okType: "danger",
    cancelText: "Cancel",
    onOk: async () => {
      // Show a loading indicator
      modal.update({ okButtonProps: { loading: true } });
      // Clear the data
      await logOut();
      // Reload the page
      location.reload();
      return true; // Don't close the modal
    },
    okButtonProps: { loading: false },
    width: 640
  });
}
