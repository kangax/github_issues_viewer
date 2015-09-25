var React = require('react');
var marked = require('marked');

var IssueCommentList = React.createClass({

  displayName: 'IssueCommentList',

  propTypes: {
    comments: React.PropTypes.array,
    isActive: React.PropTypes.func
  },

  shouldDisplayComments: function() {
    return this.props.isActive() && this.props.comments.length > 0;
  },

  render: function() {
    function createComment(comment) {

      var parsedComment = marked(comment.body, { sanitize: true });

      parsedComment = parsedComment.replace(/@[^\s]*/g, function(match) {
        return '<a href="http://github.com/' + match.slice(1) + '">' +
                  match +
               '</a>';
      });

      return (
        <li className="issue__comment" key={ comment.id }>
          <div className="issue__comment__header">
            <img className="issues__item__user-avatar" src={ comment.user.avatar_url } />
            <a href={ comment.user.html_url } className="issues__item__author">
              { comment.user.login }
            </a>
            said:
          </div>
          <div className="issue__comment__body"
               dangerouslySetInnerHTML={ { __html: parsedComment } } />
        </li>
      );
    }

    return (
      <div className="issue__comments-wrapper"
           style={ { display: this.shouldDisplayComments() ? '' : 'none' } }>
        <h2 className="issue__comments__header">
          { this.props.comments.length } comment(s)
        </h2>
        <ul className="issue__comments">
          { this.props.comments.map(createComment) }
        </ul>
      </div>
    );
  }
});

module.exports = IssueCommentList;
