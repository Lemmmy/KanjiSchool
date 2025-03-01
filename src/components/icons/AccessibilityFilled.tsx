// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import Icon from "@ant-design/icons";

export const AccessibilityFilledSvg = (): JSX.Element => (
  <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1000 1000">
    <path d="m249.75 375.37q3.7494-14.056 14.996-20.616 11.247-6.5595 25.306-4.685 136.84 32.798 209.94 32.798 73.106 0 209.94-32.798 13.121-2.8116 25.306 4.685 12.184 7.4971 14.996 20.616 2.8118 13.119-3.7494 25.301-6.5612 12.183-21.557 14.994-101.22 23.427-158.4 29.987 0.9397 82.464 8.4354 140.56 7.4978 58.099 14.059 81.527 6.5612 23.427 21.557 59.974l4.686 11.245q4.686 13.119-0.9397 25.301-5.6236 12.182-18.745 17.805-4.686 2.811-12.184 2.811-22.494 0-30.929-21.553l-4.686-11.245q-28.115-72.156-36.55-134.94h-22.494q-8.4354 62.785-36.553 134.94l-4.686 11.245q-8.4354 21.553-30.929 21.553-7.4978 0-12.184-2.811-13.122-4.6856-18.745-17.805-5.6236-13.119-0.9397-25.301l4.686-11.245q14.996-36.547 21.557-59.974 6.5612-23.427 14.059-81.527 7.4978-58.1 8.4354-140.56-57.172-6.5601-159.33-29.987-13.122-3.748-20.62-14.994-7.4978-11.245-3.7494-25.301zm183.7-75.905q0-28.113 18.745-47.791 18.745-19.679 47.8-19.679 29.055 0 46.863 19.679 17.808 19.679 19.682 47.791 1.8742 28.113-19.682 46.855-21.557 18.742-46.863 19.679-25.306 0.937-47.8-19.679-22.494-20.616-18.745-46.855zm-301.8 200.54q0 74.968 29.055 143.38 29.055 68.408 78.729 117.14 49.674 48.728 117.16 78.716 67.482 29.987 143.4 29.05 75.917-0.93707 143.4-29.05 67.482-28.113 117.16-78.716 49.674-50.603 78.729-117.14 29.055-66.534 29.055-143.38 0-76.841-29.055-143.37-29.055-66.534-78.729-117.14-49.674-50.603-117.16-78.716-67.482-28.113-143.4-29.05-75.917-0.93758-143.4 29.05-67.482 29.987-117.16 78.716-49.674 48.728-78.729 117.14-29.055 68.408-29.055 143.37zm368.34-402.01q81.541 0 155.58 31.861 74.043 31.861 128.4 86.212 54.361 54.351 85.29 128.38 30.929 74.031 32.804 155.56 1.8742 81.527-32.804 155.56-34.678 74.03-85.29 128.38-50.612 54.351-128.4 86.212-77.792 31.861-155.58 31.861-77.792 0-155.58-31.861-77.792-31.861-128.4-86.212-50.612-54.351-86.227-128.38-35.616-74.03-31.867-155.56 3.7494-81.527 31.867-155.56 28.118-74.03 86.227-128.38 58.11-54.351 128.4-86.212 70.294-31.861 155.58-31.861zm-468.63 402.01q0 95.583 37.49 181.8 37.49 86.212 99.349 149.93 61.859 63.723 149.96 99.332 88.102 35.61 181.83 37.484 93.725 1.874 181.83-37.484 88.102-39.358 149.96-99.332 61.859-59.973 99.349-149.93 37.49-89.961 37.49-181.8 0-91.835-37.49-181.8-37.49-89.961-99.349-149.93-61.859-59.974-149.96-99.332-88.102-39.358-181.83-37.484-93.725 1.8746-181.83 37.484-88.102 35.61-149.96 99.332-61.859 63.722-99.349 149.93-37.49 86.212-37.49 181.8z" stroke="#000" strokeWidth=".24796px"/>
  </svg>
);
export const AccessibilityFilled = (props: any): JSX.Element =>
  <Icon component={AccessibilityFilledSvg} {...props} />;
