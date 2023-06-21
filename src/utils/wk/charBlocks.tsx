// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

export type CharacterType = "punctuation" | "hiragana" | "katakana"
  | "fullwidth_halfwidth" | "kanji" | "other";

export interface CharacterBlock {
  type: CharacterType;
  characters: string;
}

export function getCharSymbol(char: string): CharacterType {
  const c = char.charCodeAt(0);
  if (c >= 0x3000 && c <= 0x303F) return "punctuation";
  if (c >= 0x3040 && c <= 0x309F) return "hiragana";
  if (c >= 0x30A0 && c <= 0x30FF) return "katakana";
  if (c >= 0xFF00 && c <= 0xFFEF) return "fullwidth_halfwidth";
  if (c >= 0x4E00 && c <= 0x9FAF) return "kanji";
  if (c >= 0x3400 && c <= 0x4DBF) return "kanji";
  return "other";
}

export function getJpCharBlocks(input: string): CharacterBlock[] {
  const out: CharacterBlock[] = [];

  let chars = "";
  let currentType: CharacterType | null = null;

  for (const symbol of input) {
    const type = getCharSymbol(symbol);

    // If the type is different, push this block onto the array and start a new
    // one
    if (currentType && currentType !== type) {
      out.push({ type: currentType, characters: chars });
      chars = "";
    }

    chars += symbol;
    currentType = type;
  }

  // Push the last block
  if (currentType) {
    out.push({ type: currentType, characters: chars });
  }

  return out;
}

export function renderCharBlocks(blocks: CharacterBlock[]): JSX.Element[] {
  return blocks.map(b => (
    <span
      key={`${b.type}-${b.characters}`}
      className={"char-block char-block-type-" + b.type}
    >
      {b.characters}
    </span>
  ));
}
