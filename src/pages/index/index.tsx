import { PageContainer, View } from "@tarojs/components";
import "./index.scss";
import IndexHeader from "./IndexHeader";
import { useState } from "react";
import PageView from "@/components/PageView";

const IndexPage = () => {
  const [currentDate, setCurrentDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  });

  return (
    <PageView>
      <IndexHeader date={currentDate} setDate={setCurrentDate}/>
    </PageView>
  );
};

export default IndexPage;
