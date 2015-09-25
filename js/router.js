var history = require('./utils/history.js');

var router = {

  init: function(issueList) {
    this.issueList = issueList;

    history.initState(
      document.location.hash ? null : '#/issues',
      this.onChange.bind(this));
  },

  onChange: function() {
    if (document.location.hash.match(/#\/issues\/(\d+)/)) {
      var issueId = RegExp.$1;
      this.openIssue(issueId);
    }
    else {
      var pageInUrl = (document.location.hash.match(/\?page=(\d+)/) || {})[1] || 1;
      this.showAllIssues(pageInUrl);
    }
  },

  showAllIssues: function(currentPage) {
    this.issueList.setState({
      issues: [],
      currentIssue: null,
      currentPage: currentPage
    }, function() {
      this.fetchIssues();
    });
  },

  openIssue: function(issueId) {
    if (this.issueList.state.issues.length === 0) {
      this.issueList.onDataReceivedCallback =
        this.issueList.openIssue.bind(this.issueList, issueId);
    }
    else {
      this.issueList.openIssue(issueId);
    }
  }
};

module.exports = router;
