// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Button } from "@comp/Button";
import { LogoutOutlined } from "@ant-design/icons";

import { logOut } from "@api";
import { globalModal } from "@global/AntInterface.tsx";

export function LogOutButton(): React.ReactElement {
  return <Button
    variant="link"
    danger
    onClick={logOutModal}
    className="float-right -my-[3px] -mx-[15px] !leading-none !h-auto"
  >
    Log out
  </Button>;
}

function logOutModal() {
  const modal = globalModal.confirm({
    title: "Log out",
    icon: <LogoutOutlined className="!text-red" />,
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
