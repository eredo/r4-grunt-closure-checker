
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
 * Checks whether all letters are capital.
 * @param {string} str
 * @return {boolean}
 */
var allLetterCaps = function(str) {
  return str.toUpperCase() === str;
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

/**
 * Gets the actual namespace of an array which contains the object references.
 * @param {Array.<string>} parts
 * @return {string}
 */
var getNamespace = function(parts) {

  var lp = parts[parts.length - 1];
  var first = true;
  // figure the actual namespace out
  while (lp && ((!checkFirstLetterCap(lp) && first) || lp == 'prototype' || allLetterCaps(lp))) {
    first = false;
    parts.pop();
    lp = parts[parts.length - 1];
  }
  return parts.join('.');
};

/**
 * Checks whether a namespace is available in the context.
 * @param {string} ns
 * @param {Array.<string>} av
 * @return {boolean}
 */
var isAvailable = function(ns, av) {
  for (var a = 0, aa; aa = av[a]; a++) {
    var r = new RegExp(aa);

    if (ns.match(r) !== null) {
      return true;
    }
  }

  return false;
};

// regular expression to find used libraries
var reg = /[\s|\(|;|=|\n]([a-z0-9\._]+)/gi;


/**
 * @param {string} src
 * @param {Array.<string>} available Array contains sort of regular expression for available namespaces.
 * @param {Array<string>=} opt_ignore
 * @param {boolean=} opt_generateFix
 * @returns {Array}
 */
module.exports = function(src, available, opt_ignore, opt_generateFix) {
  var matches = src.match(reg);

  //console.log(matches);
  var used = [];
  for (var i = 0, m; m = matches[i]; i++) {
    if (m.match(/\./) !== null) {
      // split into parts
      var nsp = m.trim().replace(/\s|\(|;|=|\n|\|/g, '').split(/\./i);

      // exclude basic variables
      if ((nsp.length < 2 || nsp[1] === '') || nsp[0] === 'this') {
        continue;
      }

      // exclude base goog implementations
      if (nsp.length < 3 && nsp[0] === 'goog' && !checkFirstLetterCap(nsp[1])) {
        continue;
      }

      // exclude global functions
      if (nsp[0] === 'goog' && nsp[1] === 'global') {
        continue;
      }

      var ns = getNamespace(nsp);
      if (isAvailable(ns, available) && ns.indexOf('.') !== -1 && ns.indexOf('.prototype.') === -1) {
        used.push(ns);
      }
    }
  }

  // get all require and provides
  var packs = getPackages(src);
  var missing = [];

  for (i = 0; m = used[i]; i++) {
    if (packs.provides.indexOf(m) === -1 && packs.requires.indexOf(m) === -1) {
      if (opt_ignore ? opt_ignore.indexOf(m) === -1 : true) {
        if (missing.indexOf(m) === -1) {
          missing.push(m);
        }
      }
    }
  }

  if (opt_generateFix && missing.length) {
    Array.prototype.push.apply(missing, packs.requires);
  }

  return missing;
};