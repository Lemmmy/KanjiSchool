// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Alert, Typography } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

import { DigraphMatch } from "@utils";

import { globalModal } from "@global/AntInterface.tsx";

const { Text } = Typography;

interface Props {
  digraphMatch: DigraphMatch;
}

export function DigraphAlert({ digraphMatch }: Props): JSX.Element {
  const [regular, small] = digraphMatch;

  return <Alert
    type="warning"
    message={<>
      Your answer was incorrect because you mixed up the regular kana{" "}
      <span className="ja">{regular}</span> and the small kana{" "}
      <span className="ja">{small}</span>.
      <br />
      Click here for more information about the difference between small and
      regular kana.
    </>}
    className="mb-md cursor-pointer"
    onClick={showDigraphHelp}
  />;
}

export function showDigraphHelp(): void {
  globalModal.info({
    title: "Digraph information",
    content: <DigraphHelp />,
    width: 768
  });
}

function DigraphHelp(): JSX.Element {
  return <>
    <p>
      While most kana (hiragana or katakana) stand on their own, it&rsquo;s
      possible for two kana to combine into a single unit called a
      &lsquo;digraph&rsquo;. When this happens, one of the kana is written
      small. The digraph represents a single sound that is distinct from the two
      sounds represented by the kana characters separately.
    </p>

    <p>
      <i>Example:</i> <span className="ja">にゆ</span> is typed
      &lsquo;niyu&rsquo; and pronounced &lsquo;ni-yu&rsquo;
      But <span className="ja">にゅ</span> is typed &lsquo;nyu&rsquo; and
      pronounced a bit like the English word &lsquo;new&rsquo;. Just leave out
      the &lsquo;i&rsquo; in &lsquo;ni&rsquo;, and the two sounds are
      contracted.
    </p>

    <p>
      Another common case is the small <span className="ja">つ</span>. This
      indicates that the following consonant is doubled.
      <br /><i>Example:</i> <span className="ja">にき</span> is typed
      &lsquo;niki&rsquo; and pronounced &lsquo;ni-ki&rsquo;.
      But <span className="ja">にっき</span> is typed &lsquo;nikki&rsquo; and
      pronounced with the &lsquo;k&rsquo; lengthened.
    </p>

    <p>
      As a beginner, it can be hard to notice the difference between regular and
      small kana, but over time you will get used to it.
    </p>

    <p>
      A few practical examples:
    </p>

    <DigraphExamplesTable />

    <p>
      For more information:
      <ul>
        <li><Link url="https://www.tofugu.com/japanese/how-to-type-in-japanese/"
          text="Tofugu - How to type in Japanese"/></li>
        <li><Link url="https://www.tofugu.com/japanese/learn-hiragana/"
          text="Tofugu - Learn Hiragana"/></li>
        <li><Link url="https://www.tofugu.com/japanese/learn-katkana/"
          text="Tofugu - Learn Katakana"/></li>
      </ul>
    </p>

    <p><Text type="secondary">Source: FD</Text></p>
  </>;
}

const Ack = (): JSX.Element =>
  <CheckCircleOutlined className="text-green" />;
const Nack = (): JSX.Element =>
  <CloseCircleOutlined className="text-red" />;

function DigraphExamplesTable(): JSX.Element {
  return <table className="w-full max-w-[300px] mb-md">
    <thead>
      <tr>
        <th className="text-left">Subject</th>
        <th className="text-left">Reading</th>
        <th className="text-left">Typed as</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Kanji 車</td><td>しゃ</td><td>sha</td><td><Ack /></td></tr>
      <tr><td></td><td>しや</td><td>shiya</td><td><Nack /></td></tr>

      <tr><td>Kanji 入</td><td>にゅう</td><td>nyuu</td><td><Ack /></td></tr>
      <tr><td></td><td>にゆう</td><td>niyuu</td><td><Nack /></td></tr>

      <tr><td>Kanji 力</td><td>りょく</td><td>ryoku</td><td><Ack /></td></tr>
      <tr><td></td><td>りよく</td><td>riyoku</td><td><Nack /></td></tr>

      <tr><td>Vocab 三つ</td><td>みっつ</td><td>mittsu</td><td><Ack /></td></tr>
      <tr><td></td><td>みつつ</td><td>mitsutsu</td><td><Nack /></td></tr>
    </tbody>
  </table>;
}

function Link({ text, url }: { text: string; url: string }): JSX.Element {
  return <a target="_blank" rel="noopener noreferrer" href={url}>{text}</a>;
}
