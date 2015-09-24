var $ = require('jquery');
var React = require('react');
var router = require('./router.js');
var IssueList = require('./components/issue_list.js');

$(function() {

  var issuesPerPage = 15;
  var url = 'https://api.github.com/repos/npm/npm/issues?per_page=' + issuesPerPage;

  var issueList = React.render(<IssueList url={ url } />, document.body);

  router.init(issueList);
});
