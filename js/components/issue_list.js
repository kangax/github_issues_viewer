var $ = require('jquery');
var React = require('react');
var Issue = require('./issue.js');

var history = require('../utils/history.js');

var IssueList = React.createClass({

  displayName: 'IssueList',

  propTypes: {
    currentPage: React.PropTypes.number,
    url: React.PropTypes.string
  },

  getInitialState: function() {
    return {
      issues: [ ],
      currentIssue: null,
      // TODO: this is supposedly an antipattern but how else can we do it?
      currentPage: this.props.currentPage || 1
    };
  },

  componentDidMount: function() {
    this.fetchIssues();
  },

  fetchIssues: function() {

    var $loadingIndicator = $(React.findDOMNode(this)).find('.loading-indicator');
    $loadingIndicator.show();

    $.ajax({
      url: this.getCurrentUrl(),
      dataType: 'json',
      cache: false,
      success: this.onDataReceived,
      error: this.onDataFailed,
      complete: function() {
        $loadingIndicator.hide();
      }
    });
  },

  getCurrentUrl: function() {
    var perPage = 15;

    return this.props.url +
           '?per_page=' + perPage +
           '&page=' + this.state.currentPage;
  },

  openIssue: function(issueId) {
    var issueToOpen = this.refs['issue-' + issueId];
    this.setState({ currentIssue: issueToOpen });
    issueToOpen && issueToOpen.fetchComments();
  },

  getPaginationData: function(jqXHR) {
    // parse url out of '<https://...>; rel="next"', etc.

    var link = jqXHR.getResponseHeader('Link');

    return {
      nextPage: (link.match(/\<([^\>]*)>[^<]*?; rel="next"/) || {})[1],
      lastPage: (link.match(/\<([^\>]*)>[^<]*?; rel="last"/) || {})[1],
      firstPage: (link.match(/\<([^\>]*)>[^<]*?; rel="first"/) || {})[1],
      prevPage: (link.match(/\<([^\>]*)>[^<]*?; rel="prev"/) || {})[1]
    };
  },

  onDataReceived: function(data, status, jqXHR) {
    var newState = this.getPaginationData(jqXHR);
    newState.issues = data;

    this.setState(newState, function() {
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
    history.pushState('#/issues?page=' + this.state.currentPage);
    this.setState({ currentIssue: null });

    e.preventDefault();
  },

  handlePageClick: function(i, e) {
    history.pushState('#/issues?page=' + i);
    this.setState({ currentPage: i, issues: [ ] }, function() {
      this.fetchIssues();
    });

    e.preventDefault();
  },

  getListOfIssueComponents: function() {
    return this.state.issues.map(function(issue) {
      return (
        <Issue {...issue}
            ref={ 'issue-' + issue.id }
            key={ issue.id }
            currentIssue={ this.state.currentIssue }
            handleClick={ this.handleIssueClick } />
      );
    }, this);
  },

  getListOfPagesComponents: function() {
    var pages = [ ];

    function createPage(name) {

      if (!this.state[name + 'Page']) return;

      var pageNum = this.state[name + 'Page'].match(/&page=(\d+)/)[1];

      pages.push(
        <li className="issues-pagination__page">
          <a href="#" onClick={ this.handlePageClick.bind(this, pageNum) }>
            { name }
          </a>
        </li>
      );
    }

    ['first', 'prev'].forEach(createPage.bind(this));

    pages.push(
      <li className="issues-pagination__page issues-pagination__page--current">
        <a href="#">{ this.state.currentPage }</a>
      </li>
    );

    ['next', 'last'].forEach(createPage.bind(this));

    return pages;
  },

  render: function() {
    return (
      <div className="global-wrapper">
        <h2 className="issues-header">Issues viewer</h2>
        <div
          className="back"
          style={ {'display': this.state.currentIssue ? '' : 'none'} }
          onClick={ this.handleBackClick }>
            <a href="#">← Back to issues</a>
        </div>
        <ul
          className="issues-pagination"
          style={ {'display': this.state.currentIssue ? 'none' : ''} }>
          { this.getListOfPagesComponents() }
        </ul>
        <div className="loading-indicator"></div>
        <ul className="issues">
          { this.getListOfIssueComponents() }
        </ul>
      </div>
    );
  }
});

module.exports = IssueList;
