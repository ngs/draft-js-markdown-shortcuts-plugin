'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _draftJs = require('draft-js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Image = function Image(_ref) {
  var entityKey = _ref.entityKey,
      children = _ref.children;

  var _Entity$get$getData = _draftJs.Entity.get(entityKey).getData(),
      src = _Entity$get$getData.src,
      alt = _Entity$get$getData.alt,
      title = _Entity$get$getData.title;

  return _react2.default.createElement(
    'span',
    null,
    children,
    _react2.default.createElement('img', { src: src, alt: alt, title: title })
  );
};

exports.default = Image;