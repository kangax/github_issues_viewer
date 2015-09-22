var IssueCommentList = React.createClass({

  displayName: 'IssueCommentList',

  propTypes: {
    comments: React.PropTypes.array
  },

  render: function() {
    function createComment(comment) {
      return (
        <li className="issue__comment">
          <div className="issue__comment__header">
            <a href="#">{ comment.user }</a>
          </div>
          <div className="issue__comment__body">
            { comment.body }
          </div>
        </li>
      );
    }
    return (
      <ul className="issue__comments">
        { this.props.comments.map(createComment) }
      </ul>
    );
  }
});

module.exports = IssueCommentList;
