// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useState, useEffect, useMemo } from "react";
import { Row, Col, Card, Button, Descriptions } from "antd";

import { AudioUsage, checkSupportedAudioTypes, clearAudio, getAudioUsage } from "@api";

import { nts, stringifyBytes } from "@utils";

const { Item } = Descriptions;

export function StorageUsageCard(): JSX.Element {
  return <Card title="Storage usage">
    <StorageEstimateRow />
    <AudioUsageRow />
  </Card>;
}

function StorageEstimateRow(): JSX.Element | null {
  // Load the storage estimate
  const [estimate, setEstimate] = useState<StorageEstimate>();
  useEffect(() => {
    if (!navigator?.storage?.estimate) return;
    navigator.storage?.estimate().then(setEstimate);
  }, []);

  if (!estimate) {
    return <b>Storage estimates are not available for your device. This may be due to privacy settings.</b>;
  }

  return <Descriptions title="Browser storage" bordered size="small" column={1}>
    <Item label="Storage used">{stringifyBytes(estimate.usage)}</Item>
    <Item label="Storage quota">{stringifyBytes(estimate.quota)}</Item>
  </Descriptions>;
}

function AudioUsageRow(): JSX.Element | null {
  // Load the audio usage
  const [audioUsage, setAudioUsage] = useState<AudioUsage>();
  useEffect(() => { getAudioUsage().then(setAudioUsage); }, []);

  // Supported audio formats
  const supportedTypes = useMemo(checkSupportedAudioTypes, []);

  if (!audioUsage) return null;
  return <Row gutter={24} className="mt-lg">
    <Col md={12} span={24}>
      <Descriptions title="Vocabulary audio" bordered size="small" column={1}>
        <Item label="Subjects">{nts(audioUsage.subjectCount)}</Item>
        <Item label="Audio clips">{nts(audioUsage.count)}</Item>
        <Item label="Storage usage">{stringifyBytes(audioUsage.bytes)}</Item>
      </Descriptions>

      {/* Clear all audio button */}
      <Button
        type="primary" danger
        onClick={() => clearAudio().then(getAudioUsage).then(setAudioUsage)}
        className="mt-md md:mb-0 mb-md"
      >
        Clear audio cache
      </Button>
    </Col>

    {/* Supported audio formats */}
    <Col md={12} span={24}>
      <Descriptions title="Supported audio formats" bordered size="small" column={1}>
        {Object.entries(supportedTypes).map(([type, supported]) =>
          <Item key={type} label={type}>{supported}</Item>)}
      </Descriptions>
    </Col>
  </Row>;
}
