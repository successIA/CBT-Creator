import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Layout } from "antd";
import { TopicList } from "./components/TopicList";
import { TopicDetail } from "./components/TopicDetail";
import "antd/dist/antd.css";
import "./App.css";

const { Header, Content } = Layout;

function App() {
  return (
    <div>
      <Layout>
        <Router>
          <Header>
            <span style={{ color: "#fff", fontSize: "1.3rem" }}>
              <Link to={"/"}>
                <strong>CBT Creator</strong>
              </Link>
            </span>
          </Header>
          <Content>
            <Switch>
              <Route exact path="/" component={TopicList} />
              <Route exact path="/auth/topics/:slug/" component={TopicDetail} />
            </Switch>
          </Content>
        </Router>
      </Layout>
    </div>
  );
}

export default App;
