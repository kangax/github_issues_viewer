var $ = require('jquery');
var React = require('react');
var Issue = require('./issue.js');

var history = require('../utils/history.js');

var IssueList = React.createClass({

  displayName: 'IssueList',

  propTypes: {
    url: React.PropTypes.string
  },

  getInitialState: function() {
    return {
      issues: [ ],
      currentIssue: null
    };
  },

  componentDidMount: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: this.onDataReceived,
      error: this.onDataFailed
    });
  },

  openIssue: function(issueId) {
    var issueToOpen = this.refs['issue-' + issueId];
    this.setState({ currentIssue: issueToOpen });
    issueToOpen.fetchComments();
  },

  getUrlsOfNextAndLastPages: function(jqXHR) {

    var link = jqXHR.getResponseHeader('Link');
    var pair = link.split(/\s*,\s*/);
    var reUrl = /^\<([^\>]*)>.*/;

    // parse url out of "<https://api.github.com/repositories/321278/issues?_=1443120446792&page=2>; rel="next""
    if (/rel="next"/.test(pair[0])) {
      return {
        next: pair[0].replace(reUrl, '$1'),
        last: pair[1].replace(reUrl, '$1')
      };
    }
    else if (/rel="last"/.test(pair[0])) {
      return {
        last: pair[0].replace(reUrl, '$1'),
        next: pair[1].replace(reUrl, '$1')
      };
    }
  },

  onDataReceived: function(data, status, jqXHR) {
    var urls = this.getUrlsOfNextAndLastPages(jqXHR);
    console.log(urls.next, urls.last);

    this.setState({ issues: data }, function() {
      this.onDataReceivedCallback && this.onDataReceivedCallback();
    });
  },

  onDataFailed: function(xhr, status, err) {
    console.error(this.props.url, status, err.toString());
  },

  handleIssueClick: function(issue) {
    history.pushState('#/issues/' + issue.props.id);
    this.setState({ currentIssue: issue });
  },

  handleBackClick: function(e) {
    history.pushState('#/issues');
    this.setState({ currentIssue: null });

    e.preventDefault();
  },

  render: function() {
    var issues = this.state.issues.map(function(issue) {
      return (
        <Issue {...issue}
            ref={ 'issue-' + issue.id }
            key={ issue.id }
            currentIssue={ this.state.currentIssue }
            handleClick={ this.handleIssueClick } />
      );
    }, this);

    return (
      <div className="global-wrapper">
        <h2 className="issues-header">Issues viewer</h2>
        <div
          className="back"
          style={ {'display': this.state.currentIssue ? '' : 'none'} }
          onClick={ this.handleBackClick }>
            <a href="#">← Back to issues</a>
        </div>
        <div className="loading-indicator"
             style={ { display: this.state.issues.length > 0 ? 'none' : '' } }></div>
        <ul className="issues">
          { issues }
        </ul>
      </div>
    );
  }
});

module.exports = IssueList;
