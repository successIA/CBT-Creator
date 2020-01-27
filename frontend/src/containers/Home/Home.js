import React from "react";
import { connect } from "react-redux";
import { fetchTopics, deleteTopic, showModal } from "../../actions";
import TopicList from "../../components/TopicList";

class Home extends React.Component {
  componentDidMount() {
    this.props.fetchTopics();
  }

  render() {
    const {
      isLoading,
      topics,
      fetchError,
      showModal,
      deleteTopic
    } = this.props;

    return (
      <TopicList
        isLoading={isLoading}
        topics={topics}
        fetchError={fetchError}
        showModal={showModal}
        deleteTopic={deleteTopic}
      />
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.home.isLoading,
  topics: state.home.topics,
  fetchError: state.home.fetchError
});

const mapDispatchToProps = {
  fetchTopics,
  showModal,
  deleteTopic
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
