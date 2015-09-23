var $ = require('jquery');
var React = require('react');
var IssueList = require('./components/issue_list.js');

var utils = require('./utils.js');

$(function() {

  utils.initState(!document.location.hash ? '#/issues' : null, function() {
    if (document.location.hash === '#/issues') {
      issueList.setState({ currentIssue: null });
      console.log('showing all issues');
    }
    else if (document.location.hash.match(/#\/issues\/(\d+)/)) {
      var issueId = RegExp.$1;

      function openIssue() {
        var issueToOpen = issueList.refs['issue-' + issueId];
        issueList.setState({ currentIssue: issueToOpen });
      }

      if (issueList.state.issues.length === 0) {
        issueList.onDataReceivedCallback = openIssue;
      }
      else {
        openIssue();
      }
    }
  });

  var issueList = React.render(<IssueList url="https://api.github.com/repos/npm/npm/issues" />,
    document.body);

});
