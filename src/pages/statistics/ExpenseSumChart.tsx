import MediaCard from "@/components/MediaCard";
import { Chart, Axis, Line, Point } from "@antv/f2";
import { Canvas } from "@tarojs/components";
import { memo } from "react";
import F2 from "../../components/F2";

type PropsType = {
  year: number;
  month: number;
  data: BillAPI.BillRecord[];
}

const ExpenseSumChart = (props: PropsType) => {
  const { year, month, data } = props;
  const dayCount = new Date(year, month, 0).getDate();

  const newData = Array(dayCount)
    .fill(0).map((_, index) =>
      ({ label: index < 9 ? `0${index + 1}` : index.toString(), sum: 0 })
    );

  data.forEach(item => {
    const day = parseInt(item.date.split("-")[2]);
    newData[day - 1].sum += item.value;
  });

  const scale = {
    label: {
      tickCount: dayCount / 2
    },
    sum: {
      tickCount: 4,
      min: 0,
      formatter: (val) => val.toFixed(0)
    },
  };

  return (
    <MediaCard title="日收支统计" style={{ height: "300Px"}}>
      <F2 chartId="expense-sum-chart">
        <Canvas>
          <Chart data={newData} scale={scale} >
            <Axis
              field="label"
              style={{ label: { align: "between" } }}
            />
            <Axis field="sum" />
            <Line x="label" y="sum" lineWidth="4px" shape="smooth" style={{ stroke: "#29cf74"}}/>
            <Point x="label" y="sum" color="#009c50" />
          </Chart>
        </Canvas>
      </F2>
    </MediaCard>
  );

};

export default memo(ExpenseSumChart);
