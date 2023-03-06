import { Canvas } from "@tarojs/components";
import Taro, { useReady } from "@tarojs/taro";
import { useState, useEffect, useRef } from "react";
import { Canvas as AntVCanvas } from "@antv/f2";
import { ChartProps } from "@antv/f2/es/canvas";

type PropsType = {
  children: JSX.Element;
}

const F2 = (props: PropsType) => {
  const staticConfig = useRef<ChartProps>();
  const chartRef = useRef<AntVCanvas>();
  const [isReady, setIsReady] = useState(false);
  const { children } = props;

  useReady(() => {
    const query = Taro.createSelectorQuery();
    query.select("#myChart")
      .fields({node: true, size: true})
      .exec((res) => {
        const { node, width, height } = res[0];
        const pixelRatio = Taro.getSystemInfoSync().pixelRatio;
        node.width = width * pixelRatio;
        node.height = height * pixelRatio;
        staticConfig.current = {
          context: node.getContext("2d"), // TODO: transform
          pixelRatio,
          height,
          width,
        };
        setIsReady(true);
      });
  });

  const renderChart = (config) => {
    chartRef.current = new AntVCanvas(config);
    chartRef.current.render();
  };

  useEffect(() => {
    if (!isReady) return;
    const { props: dynamicConfig } = children;
    renderChart({ ...dynamicConfig, ...staticConfig.current});
  }, [children, isReady]);

  return (
    <Canvas
      type="2d"
      canvasId="myChart"
      id="myChart"
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default F2;
