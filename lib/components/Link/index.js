'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _draftJs = require('draft-js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Link = function Link(props) {
  var _Entity$get$getData = _draftJs.Entity.get(props.entityKey).getData(),
      href = _Entity$get$getData.href,
      title = _Entity$get$getData.title;

  return _react2.default.createElement(
    'a',
    { href: href, title: title },
    props.children
  );
};

exports.default = Link;