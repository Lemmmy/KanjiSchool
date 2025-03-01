// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

type RecognitionResult = ["SUCCESS", [string, string[], string[], { is_html_escaped: boolean }][]];

const API = "https://www.google.com/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8";

export async function recognize(
  trace: number[][][],
  width: number,
  height: number
): Promise<string[]> {
  const req = {
    options: "enable_pre_space",
    requests: [{
      writing_guide: {
        writing_area_width: width,
        writing_area_height: height
      },
      ink: trace,
      language: "ja",
      max_completions: 0,
      max_num_results: 8,
      pre_context: "" // TODO
    }]
  };

  try {
    const data = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(req)
    })
      .then(res => res.json()) as RecognitionResult;
    return data[1][0][1];
  } catch (e) {
    console.error(e);

    // Most likely, the user is offline (and offline detection failed).
    // Return no results on error.
    return [];
  }
}
