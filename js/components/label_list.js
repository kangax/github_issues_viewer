var React = require('react');

var LabelList = React.createClass({

  displayName: 'LabelList',

  propTypes: {
    labels: React.PropTypes.array
  },

  render: function() {
    function createLabel(label) {
      return (
        <li className="issues__item__label" key={ label.name }>
          <a href={ label.url }>
            { label.name }
          </a>
        </li>
      );
    }
    return (
      <ul className="issues__item__labels">
        { this.props.labels.map(createLabel) }
      </ul>
    );
  }
});

module.exports = LabelList;
