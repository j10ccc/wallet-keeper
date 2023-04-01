import F2 from "@/components/F2";
import MediaCard from "@/components/MediaCard";
import { Canvas, Chart, Interval, PieLabel } from "@antv/f2";
import { itemValueLabelMap } from "@/constants/RecordItemList";
import { memo } from "react";

type PropsType = {
  data: BillAPI.BillRecord[];
};

const KindChart = (props: PropsType) => {
  const { data } = props;

  const tmp = {};

  data.forEach((item) => {
    if (!tmp[item.kind]) tmp[item.kind] = 0;
    tmp[item.kind] += item.value;
  });

  const newData = Object.keys(tmp).map((item) => ({
    kind: item,
    value: tmp[item],
    type: "data",
  }));

  const coord = {
    transposed: true,
    type: "polar",
    radius: 0.75,
  };

  return (
    <MediaCard style={{ height: "300px" }} title="分类统计">
      <F2 chartId="kind-chart">
        <Canvas>
          <Chart data={newData} coord={coord}>
            <Interval
              x="type"
              y="value"
              adjust="stack"
              color={{
                field: "kind",
                range: ["#1890FF", "#13C2C2", "#2FC25B", "#FACC14", "#F04864"],
              }}
            />
            <PieLabel
              label1={(data, record) => ({
                text: itemValueLabelMap[data.kind],
                fill: record.color,
                fontSize: 14,
              })}
              label2={(data) => ({
                fill: "#000",
                text: `¥${data.value}`,
                fontWeight: 500,
              })}
            />
          </Chart>
        </Canvas>
      </F2>
    </MediaCard>
  );
};

export default memo(KindChart);
