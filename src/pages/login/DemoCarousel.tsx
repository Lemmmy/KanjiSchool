import { Carousel, Image } from "antd";

export function DemoCarousel(): JSX.Element {
  return <Carousel
    autoplay
    dots={false}
    className="demo-carousel"
    style={{ width: 240 }}
  >
    <Image width={240} src="/kanjischool-demo-1.jpg" />
    <Image width={240} src="/kanjischool-demo-2.jpg" />
    <Image width={240} src="/kanjischool-demo-3.jpg" />
    <Image width={240} src="/kanjischool-demo-4.jpg" />
  </Carousel>;
}
