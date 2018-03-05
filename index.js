var DEFAULT_LIST_PATTERN = 'listPattern-type-standard';

// Internal function that extracts the important bits of the CLDR data
// and throws away the cruft.
function extractListPatterns(data) {
  // Break early if we have a reduced config object
  if (typeof data[DEFAULT_LIST_PATTERN] == 'object') {
    return data;
  }

  // Determine the key where the actual config values lie
  if (data && data.main)
    for (var key in data.main) {
      if (data.main.hasOwnProperty(key)) {
        if (
          data.main[key] &&
          data.main[key].listPatterns &&
          data.main[key].listPatterns[DEFAULT_LIST_PATTERN]
        ) {
          return data.main[key].listPatterns;
        }
      }
    }

  throw new Error('Could not find listPattern set in configuration data.');
}

/**
 * @param {object} cldrData Ideally you just take the cldr-js value for your locale and pass it straight in
 * @param {object} [_defaultConfig] Set a default configuration override for every invocation of the resulting formatter
 *
 * @returns {function} This returns a formatter function that obeys the locale and default configuration rules
 */
function ListPattern(cldrData, _defaultConfig) {
  var formatter = function listPatternFormatter(list) {
    return list.join(', ');
  };

  formatter.__cldr__ = extractListPatterns(cldrData);

  return formatter;
}

module.exports = ListPattern;
