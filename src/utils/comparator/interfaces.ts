// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

export interface Comparator<T> {
  (a: T, b: T): number;
}

export type Mutation<T> = (c: Comparator<T>) => Comparator<T>;

export enum MutationType {
  MAP = "map",
  REVERSE = "reverse",
  IF = "if"
}

export type MutationDescriptor<T> = ReverseMutationDescriptor | MapMutationDescriptor<T> | IfMutationDescriptor<T>;

export interface MutationDescriptorBase {
  type: MutationType;
}

export interface ReverseMutationDescriptor extends MutationDescriptorBase {
  type: MutationType.REVERSE;
}

export interface MapMutationDescriptor<T> extends MutationDescriptorBase {
  type: MutationType.MAP;
  mapper: Mapper<T>;
}

export interface IfMutationDescriptor<T> extends MutationDescriptorBase {
  type: MutationType.IF;
  condition: Condition<T>;
  comparator?: Comparator<T>;
}

export type Mapper<T> = (item: T) => T;
export type Condition<T> = (item: T) => boolean;
