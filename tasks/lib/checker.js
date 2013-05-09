
/**
 * Checks whether the first letter of a string is a capital letter.
 * @param {string} str
 * @return {boolean}
 */
var checkFirstLetterCap = function(str) {
  if (str.length < 1) {
    return false;
  }
  var fl = str.substr(0,1);
  return fl.toLowerCase() !== fl;
};

/**
 * Gets the requirements and providing objects of the source code.
 * @param {string} data Data of the file.
 * @return {{provides:Array.<string>,requires:Array.<string>}}
 */
var getPackages = function(data) {

  var reg = /goog\.require\(['|"]([^'|"]+)['|"]\);/g;
  var provReg = /goog\.provide\(['|"]([^'|"]+)['|"]\);/g;

  var requirements = [];
  var packs = [];

  var reqMatch;
  while ((reqMatch = reg.exec(data.toString())) !== null) {
    requirements.push(reqMatch[1]);
  }

  var provMatch;
  while ((provMatch = provReg.exec(data.toString())) !== null) {
    packs.push(provMatch[1]);
  }

  return {
    provides: packs,
    requires: requirements
  };
};

// regular expression to find used libraries
var reg = /[\s|\(|;|=|\n]([a-z\._]+)/gi;

/**
 *
 * @param {string} src
 * @param {Array<string>=} opt_ignore
 * @returns {Array}
 */
module.exports = function(src, opt_ignore) {
  var matches = src.match(reg);
  var used = [];
  for (var i = 0, m; m = matches[i]; i++) {
    if (m.match(/\./) !== null) {
      // split into parts
      var nsp = m.trim().replace(/\s|\(|;|=|\n/g, '').split('.');

      // exclude base goog implementations
      if (nsp.length < 3 && nsp[0] === 'goog' && !checkFirstLetterCap(nsp[1])) {
        continue;
      }

      // figure the actual namespace out
      if (!checkFirstLetterCap(nsp[nsp.length - 1])) {
        nsp.pop();
      }

      var ns = nsp.join('.');
      used.push(ns);
    }
  }

  // get all require and provides
  var packs = getPackages(src);
  var missing = [];

  for (i = 0; m = used[i]; i++) {
    if (packs.provides.indexOf(m) === -1 && packs.requires.indexOf(m) === -1) {
      if (opt_ignore && opt_ignore.indexOf(m) === -1) {
        missing.push(m);
      }
    }
  }

  return missing;
};