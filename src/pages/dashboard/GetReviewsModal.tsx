// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { globalModal } from "@global/AntInterface.tsx";
import { Button } from "antd";

export function openGetReviewsModal(): void {
  globalModal.info({
    title: "Review history changes",
    content: <div>
      In April 2023, WaniKani turned off the ability for third-party applications to get the review history. This will
      impact the accuracy of the review heatmap and streak counter. KanjiSchool will remember your review history for
      reviews made on the site, but cannot get history for reviews made on other sites or apps.
    </div>,

    maskClosable: true,
    width: 500,


    footer: (_, { OkBtn }) => [
      // Learn more link
      <Button
        key="learn-more"
        href="https://community.wanikani.com/t/api-changes-get-all-reviews/61617"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn more
      </Button>,

      // Got it button
      <OkBtn key="ok" />
    ]
  });
}
