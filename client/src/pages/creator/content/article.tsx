import { useState } from "react";
import { Input, Tabs } from "antd";
import Layout from "@/components/page/creator/Layout";
import ArticleList from "@/components/page/creator/ArticleList";

// 创作者中心-内容管理-文章管理
const ContentArticle = () => {
  let { Search } = Input;
  let [keyword, setKeyword] = useState("");

  return (
    <Layout className="p-4 bg-white">
      <div className="shadow-sm">
        <Tabs
          defaultActiveKey="1"
          tabBarExtraContent={{
            right: (
              <Search
                placeholder="标题或摘要关键字"
                onSearch={val => setKeyword(val)}
                maxLength={30}
                style={{ width: 200 }}
              />
            ),
          }}
          items={[
            {
              label: "文章",
              key: "1",
              children: <ArticleList state={1} keyword={keyword} />,
              forceRender: true,
            },
            {
              label: "草稿箱",
              key: "2",
              children: <ArticleList state={0} keyword={keyword} />,
              forceRender: true,
            },
          ]}
        />
      </div>
    </Layout>
  );
};
export default ContentArticle;
