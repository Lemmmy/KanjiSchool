// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ReactNode } from "react";
import classNames from "classnames";
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint";

import { lockedSquareTextClasses } from "@pages/dashboard/srs-stages/styles.ts";

export function PalettePreview(): React.ReactElement {
  const { md } = useBreakpoint();

  return <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-md my-lg pr-[36px]">
    {/* Subject types */}
    <div>
      <Title>Subject types</Title>

      <div className="flex gap-xs">
        <SubjectSquare label="Radical" previewText="魚"
          className="bg-radical text-radical-text" />
        <SubjectSquare label="Kanji" previewText="鰐"
          className="bg-kanji text-kanji-text" />
        <SubjectSquare label="Vocabulary" previewText="蟹"
          className="bg-vocabulary text-vocabulary-text" />
      </div>
    </div>

    {/* SRS stages */}
    <div>
      <Title>SRS stages</Title>

      <div className="grid grid-cols-4 gap-xs flex-1">
        <SrsStageSquare label="Appr"   className="bg-srs-apprentice" />
        <SrsStageSquare label="Guru"   className="bg-srs-guru" />
        <SrsStageSquare label="Master" className="bg-srs-master" />
        <SrsStageSquare label="Enl"    className="bg-srs-enlightened" />
      </div>
    </div>

    {/* SRS sub-stages */}
    <div className="lg:col-span-2 flex-1">
      <Title>SRS sub-stages</Title>

      <div className="grid grid-cols-4 gap-xs flex-1">
        <SrsStageSquare
          label="Locked"
          className={classNames("bg-srs-locked", lockedSquareTextClasses)}
          rootClassName="col-span-2"
        />
        <SrsStageSquare label="Lesson" className="bg-srs-lesson" rootClassName="col-span-2" />

        <SrsStageSquare label={md ? "Apprentice I"   : "Appr I"}
          className="bg-srs-apprentice-1 palette-fdl:text-black" />
        <SrsStageSquare label={md ? "Apprentice II"  : "Appr II"}
          className="bg-srs-apprentice-2 palette-fdl:text-black" />
        <SrsStageSquare label={md ? "Apprentice III" : "Appr III"} className="bg-srs-apprentice-3" />
        <SrsStageSquare label={md ? "Apprentice IV"  : "Appr IV"}  className="bg-srs-apprentice-4" />

        <SrsStageSquare label={md ? "Guru I / Guru II" : "Guru"}   className="bg-srs-guru" />
        <SrsStageSquare label="Master"                             className="bg-srs-master" />
        <SrsStageSquare label={md ? "Enlightened"      : "Enl"}    className="bg-srs-enlightened" />
        <SrsStageSquare label="Burned"
          className="bg-srs-burned palette-fdl:text-white" />
      </div>
    </div>
  </div>;
}

interface SubjectSquareProps {
  label: string;
  previewText: string;
  className?: string;
}

function SubjectSquare({ label, previewText, className }: SubjectSquareProps): React.ReactElement {
  return <div className="flex-1">
    <div className={classNames(
      "p-sm leading-none rounded-sm text-[32px] font-ja text-center",
      "transition-colors",
      className
    )}>
      {previewText}
    </div>

    <div className="text-center text-sm font-medium">{label}</div>
  </div>;
}


interface SrsStageSquareProps {
  label: string;
  className?: string;
  rootClassName?: string;
}

function SrsStageSquare({ label, className, rootClassName }: SrsStageSquareProps): React.ReactElement {
  return <div className={classNames("flex-1", rootClassName)}>
    <div className={classNames(
      "w-full p-sm rounded-sm text-md font-ja leading-[32px] text-center text-shared-stages-text",
      "transition-colors",
      className
    )}>
      {label}
    </div>
  </div>;
}

function Title({ children }: { children: ReactNode }): React.ReactElement {
  return <div className="text-center mb-xs leading-none font-medium">
    {children}
  </div>;
}
