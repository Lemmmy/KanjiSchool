import { Carousel, Image } from "antd";

export function DemoCarousel(): React.ReactElement {
  return <Carousel
    autoplay
    dots={false}
    className="w-[240px] ml-0 md:ml-md [&_.ant-image-img]:rounded"
  >
    <Image width={240} src="/kanjischool-demo-1.jpg" />
    <Image width={240} src="/kanjischool-demo-2.jpg" />
    <Image width={240} src="/kanjischool-demo-3.jpg" />
    <Image width={240} src="/kanjischool-demo-4.jpg" />
  </Carousel>;
}
