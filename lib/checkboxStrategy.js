'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _draftJs = require('draft-js');

// import getTypeByTrigger from './utils/getTypeByTrigger';

var findCheckbox = function findCheckbox(trigger) {
  return function (character) {
    var entityKey = character.getEntity();
    return entityKey !== null && _draftJs.Entity.get(entityKey).getType() === getTypeByTrigger(trigger);
  };
};

var findCheckboxEntities = function findCheckboxEntities(trigger) {
  return function (contentBlock, callback) {
    contentBlock.findEntityRanges(findCheckbox(trigger), callback);
  };
};

exports.default = findCheckboxEntities;