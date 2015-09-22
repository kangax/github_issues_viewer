var IssueCommentList = React.createClass({

  displayName: 'IssueCommentList',

  propTypes: {
    comments: React.PropTypes.array,
    isActive: React.PropTypes.boolean
  },

  render: function() {
    function createComment(comment) {
      return (
        <li className="issue__comment">
          <div className="issue__comment__header">
            <img className="issues__item__user-avatar" src={ comment.user.avatar_url } />
            <a href={ comment.user.html_url } className="issues__item__author">
              { comment.user.login }
            </a>
            said:
          </div>
          <div className="issue__comment__body">
            { comment.body }
          </div>
        </li>
      );
    }
    return (
      <div className="issue__comments-wrapper"
           style={ {display: this.props.isActive() ? '' : 'none'} }>
        <h2 className="issue__comments__header">
          Comments
        </h2>
        <ul className="issue__comments">
          { this.props.comments.map(createComment) }
        </ul>
      </div>
    );
  }
});

module.exports = IssueCommentList;
