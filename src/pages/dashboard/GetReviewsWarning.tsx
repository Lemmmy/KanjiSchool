// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Alert, Button, Space } from "antd";

import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { lsSetBoolean } from "@utils";
import { useAppSelector } from "@store";
import { setGetReviewsWarning } from "@store/settingsSlice.ts";

export function GetReviewsWarning(): JSX.Element | null {
  const dispatch = useDispatch();

  const acknowledged = useAppSelector(state => state.settings.getReviewsWarning);

  const hide = useCallback(() => {
    lsSetBoolean("getReviewsWarning", true);
    dispatch(setGetReviewsWarning(true));
  }, [dispatch]);

  if (acknowledged) return null;

  return <Alert
    type="warning"
    className="mb-lg"
    onClose={hide}
    closable
    message={<div>
      <p className="mt-0">
        In April 2023, WaniKani turned off the ability for third-party applications to get the review history. This will
        impact the accuracy of the review heatmap and streak counter. KanjiSchool will remember your review history for
        reviews made on the site, but cannot get history for reviews made on other sites or apps.
      </p>

      <Space direction="horizontal">
        <Button
          onClick={hide}
          type="primary"
        >
          Got it
        </Button>

        <Button
          href="https://community.wanikani.com/t/api-changes-get-all-reviews/61617"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn more
        </Button>
      </Space>
    </div>}
  />;
}
