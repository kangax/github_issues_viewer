var Issue = require('./issue.js');

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
      success: this.onDataReceived.bind(this),
      error: this.onDataFailed.bind(this)
    });
  },

  onDataReceived: function(data) {
    this.setState({ issues: data });
  },

  onDataFailed: function(xhr, status, err) {
    console.error(this.props.url, status, err.toString());
  },

  handleIssueClick: function(issue) {
    this.setState({ currentIssue: issue });
  },

  handleBackClick: function() {
    this.setState({ currentIssue: null });
    return false;
  },

  render: function() {
    var issues = this.state.issues.map(function(issue) {
      return (
        <Issue {...issue}
            currentIssue={ this.state.currentIssue }
            handleClick={ this.handleIssueClick.bind(this) } />
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
        <ul className="issues">
          { issues }
        </ul>
      </div>
    );
  }
});

module.exports = IssueList;
