// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useEffect, useMemo, useState } from "react";
import { Button, Col, Descriptions, Row } from "antd";

import { AudioUsage, checkSupportedAudioTypes, clearAudio, getAudioUsage } from "@api";
import { nts, stringifyBytes } from "@utils";
import { ExtLink } from "@comp/ExtLink.tsx";
import { AudioSupportedIcon } from "./AudioSupportedIcon.tsx";

const { Item } = Descriptions;

export function AudioStorageUsage(): JSX.Element {
  // Load the audio usage
  const [audioUsage, setAudioUsage] = useState<AudioUsage>();
  useEffect(() => { getAudioUsage().then(setAudioUsage); }, []);

  // Supported audio formats
  const supportedTypes = useMemo(checkSupportedAudioTypes, []);

  if (!audioUsage) return <span>Loading...</span>;

  return <>
    <p className="whitespace-normal text-justify mr-lg">
      Most vocabulary items have audio clips for their readings. Newer items may not have audio yet. Where audio is
      available, it will usually have two different voices, and a variety of audio formats to ensure compatibility with
      as many devices as possible. <ExtLink href="https://knowledge.wanikani.com/wanikani/audio/">More info</ExtLink>
    </p>

    <p className="whitespace-normal text-justify mr-lg">
      KanjiSchool automatically downloads audio clips for the vocabulary items in your current level (at the Lesson and
      Apprentice stages), as well as the items in your review sessions when starting them. When downloaded, they will be
      available offline.
    </p>

    <Row gutter={24} className="mt-md mb-lg pr-lg">
      <Col md={12} span={24}>
        <h4 className="mt-0 mb-xs font-medium">Audio storage usage</h4>
        <Descriptions bordered size="small" column={1}>
          <Item label="Subjects">{nts(audioUsage.subjectCount)}</Item>
          <Item label="Audio clips">{nts(audioUsage.count)}</Item>
          <Item label="Storage usage">{stringifyBytes(audioUsage.bytes)}</Item>
        </Descriptions>
      </Col>

      {/* Supported audio formats */}
      <Col md={12} span={24}>
        <h4 className="mt-0 mb-xs font-medium">Supported audio formats</h4>
        <Descriptions bordered size="small" column={1}>
          {Object.entries(supportedTypes).map(([type, supported]) => (
            <Item key={type} label={type.replace("audio/", "")}>
              <AudioSupportedIcon supported={supported} />
            </Item>
          ))}
        </Descriptions>
      </Col>
    </Row>

    {/* Clear all audio button */}
    <Button
      type="primary" danger
      onClick={() => clearAudio().then(getAudioUsage).then(setAudioUsage)}
      className="md:mb-0 mb-md"
    >
      Clear downloaded audio clips
    </Button>

    <p className="whitespace-normal text-sm text-desc mt-xs">
      If you have a lot of audio clips, you can clear them to free up space. They will be downloaded again when
      needed.
    </p>
  </>;
}
