import React from "react";
import { connect } from "react-redux";
import { fetchTopic, showModal } from "../../actions";
import { deleteQuestion } from "../../actions/question";
import TopicDetail from "../../components/TopicDetail";
import TopicDetailTable from "../../components/TopicDetailTable";

class Topic extends React.Component {
  slug = this.props.match.params.slug;

  componentDidMount() {
    this.props.fetchTopic(this.slug);
  }

  render() {
    const {
      isLoading,
      slug,
      title,
      question,
      singleTypeQuestion,
      multipleTypeQuestion,
      questions,
      fetchError,
      showModal,
      deleteQuestion
    } = this.props;

    return (
      // <TopicDetail
      //   isLoading={isLoading}
      //   slug={slug}
      //   title={title}
      //   questions={questions}
      //   fetchError={fetchError}
      //   showModal={showModal}
      //   deleteQuestion={deleteQuestion}
      // />
      <TopicDetailTable
        isLoading={isLoading}
        slug={slug}
        title={title}
        question={question}
        singleTypeQuestion={singleTypeQuestion}
        multipleTypeQuestion={multipleTypeQuestion}
        questions={questions}
        fetchError={fetchError}
        showModal={showModal}
        deleteQuestion={deleteQuestion}
      />
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.topic.isLoading,
  slug: state.topic.slug,
  title: state.topic.title,
  question: state.question.saved,
  singleTypeQuestion: state.question.savedSingleType,
  multipleTypeQuestion: state.question.savedMultipleType,
  questions: state.topic.questions,
  fetchError: state.topic.fetchError
});

const mapDispatchToProps = {
  fetchTopic,
  showModal,
  deleteQuestion
};

export default connect(mapStateToProps, mapDispatchToProps)(Topic);
