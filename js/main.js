var $ = require('jquery');
var React = require('react');
var router = require('./router.js');
var IssueList = require('./components/issue_list.js');

$(function() {

  var currentPage = parseInt(
    (document.location.hash.match(/\?page=(\d+)/) || {})[1] || 1, 10);

  var issueList = React.render(
    <IssueList
      url="https://api.github.com/repos/npm/npm/issues"
      currentPage={ currentPage } />,
    document.body);

  router.init(issueList);
});
