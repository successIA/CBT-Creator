import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Layout } from "antd";
import Home from "../containers/Home";
import ModalRoot from "../containers/ModalRoot";
import Topic from "../containers/Topic";
import "antd/dist/antd.css";
import "./App.css";
import TopicListTable from "../components/TopicListTable";

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
              <Route exact path="/" component={Home} />
              {/* <Route exact path="/" component={TopicListTable} /> */}

              <Route exact path="/auth/topics/:slug/" component={Topic} />
            </Switch>
            <ModalRoot />
          </Content>
        </Router>
      </Layout>
    </div>
  );
}

export default App;
