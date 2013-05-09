goog.provide('test.blub');

goog.require('goog.dom');
goog.require('goog.style');

var test = goog.dom.createDom('div');
goog.style.setStyle(test, 'blub');

if (goog.isNull(test)) {
  goog.notExists.Blub();
}

