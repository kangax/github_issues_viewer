var React = require('react');
var LabelList = require('./label_list.js');
var IssueCommentList = require('./issue_comment_list.js');
var marked = require('marked');

var Issue = React.createClass({

  displayName: 'Issue',

  propTypes: {
    body: React.PropTypes.string,
    comments: React.PropTypes.number,
    comments_url: React.PropTypes.string,
    currentIssue: React.PropTypes.object,
    handleClick: React.PropTypes.func,
    id: React.PropTypes.number.isRequired,
    labels: React.PropTypes.array,
    number: React.PropTypes.number,
    title: React.PropTypes.string.isRequired,
    user: React.PropTypes.object
  },

  getInitialState: function() {
    return {
      comments: [ ]
    };
  },

  EXCERPT_LENGTH: 140,

  getSummary: function() {
    var body = this.props.body,
        parsed = marked(body, { sanitize: true }),
        excerpt = body.slice(0, 140) + (body.length > this.EXCERPT_LENGTH ? '…' : '');

    return this.isActive() ? parsed : excerpt;
  },

  handleClick: function(e) {
    this.props.handleClick(this);
    this.fetchComments();

    e.preventDefault();
  },

  fetchComments: function() {
    if (this.props.comments === 0 ||
        this.state.comments.length > 0) return;

    $.get(this.props.comments_url, function(comments) {
      this.setState({ comments: comments });
    }.bind(this));
  },

  isActive: function() {
    return this.props.currentIssue === this;
  },

  shouldDisplay: function() {
    return this.props.currentIssue === null ||
           this.props.currentIssue === this;
  },

  render: function() {

    // TODO: why doesn't reqire('react/addons') work?!
    // var issueClasses = React.addons.classSet({
    //   'issues__item': true,
    //   'issues__item--current': this.isActive(),
    //   'issues__item--hidden': !this.shouldDisplay()
    // });

    var issueClasses = 'issues__item' +
                       (this.isActive() ? ' issues__item--current' : '') +
                       (this.shouldDisplay() ? '' : ' issues__item--hidden');

    return (
      <li className={ issueClasses }
          data-issue-id={ this.props.id }>

        <h3 className="issues__item__title">
          <a href="#" onClick={ this.handleClick }>
            { this.props.title }
          </a>
        </h3>

        <div className="issues__item__meta">
          <span className="issues__item__number">
            #{ this.props.number }
          </span>
          opened by
          <img className="issues__item__user-avatar" src={ this.props.user.avatar_url } />
          <a href={ this.props.user.html_url } className="issues__item__author">
            { this.props.user.login }
          </a>
        </div>

        <LabelList labels={ this.props.labels } />

        <div
          className="issues__item__summary"
          dangerouslySetInnerHTML={ { __html: this.getSummary() } } />

        <IssueCommentList comments={ this.state.comments } isActive={ this.isActive } />

      </li>
    );
  }
});

module.exports = Issue;
