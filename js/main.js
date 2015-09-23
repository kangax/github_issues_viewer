var $ = require('jquery');
var React = require('react');
var IssueList = require('./components/issue_list.js');

$(function() {

  React.render(<IssueList url="https://api.github.com/repos/npm/npm/issues" />,
    document.body);
});
