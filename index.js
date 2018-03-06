var DEFAULT_LIST_PATTERN = 'standard';
var LIST_PATTERN_PREFIX = 'listPattern-type-';

// Internal function that extracts the important bits of the CLDR data
// and throws away the cruft.
function extractListPatterns(data) {
  // Break early if we have a reduced config object
  if (typeof data[LIST_PATTERN_PREFIX + DEFAULT_LIST_PATTERN] == 'object') {
    return data;
  }

  // Determine the key where the actual config values lie
  if (data && data.main)
    for (var key in data.main) {
      if (data.main.hasOwnProperty(key)) {
        if (
          data.main[key] &&
          data.main[key].listPatterns &&
          data.main[key].listPatterns[
            LIST_PATTERN_PREFIX + DEFAULT_LIST_PATTERN
          ]
        ) {
          return data.main[key].listPatterns;
        }
      }
    }

  throw new Error('Could not find listPattern set in configuration data.');
}

// Logic to format the literal length rules (e.g. "2": "{0} and {1}")
function formatLiteralPattern(list, listPattern) {
  // The string we'll build up
  var result = listPattern;

  // This means we have a special handling for just this number of elements
  list.forEach(function(listItem, idx) {
    result = result.replace('{' + idx + '}', listItem);
  });

  return result;
}

function listPatternFormatter(list) {
  var listPatternRules =
    this.__cldr__[LIST_PATTERN_PREFIX + this.__config__.patternType] ||
    this.__cldr__[LIST_PATTERN_PREFIX + DEFAULT_LIST_PATTERN];

  if (!listPatternRules) {
    throw new Error('Unable to find a valid list pattern or fallback pattern.');
  }

  // Check for literal length rules
  if (listPatternRules.hasOwnProperty(list.length + '')) {
    return formatLiteralPattern(list, listPatternRules[list.length + '']);
  }

  // If we're here, we've got a standard "start" "middle" "end" situation
  var result = '';

  // This is the "correct" output, but if someone got here, they probably
  // already wanted to handle the empty case.
  if (list.length < 1) {
    return '';
  }

  // This is also a 'silent failure' mode, but ideally handled externally
  if (list.length === 1) {
    return list[0];
  }

  // Start with end
  var pointer = list.length - 1;
  result = listPatternRules.end
    .replace('{1}', list[pointer])
    .replace('{0}', list[pointer - 1]);

  // We used up 2 indexes already
  pointer = pointer - 2;

  // Fill in the middle section
  while (pointer > 0) {
    result = listPatternRules.middle
      .replace('{1}', result)
      .replace('{0}', list[pointer]);
    pointer -= 1;
  }

  // Handle the 'start' base-case
  result = listPatternRules.start
    .replace('{1}', result)
    .replace('{0}', list[pointer]);

  return result;
}

/**
 * @param {object} cldrData Ideally you just take the cldr-js value for your
 * locale and pass it straight in
 * @param {object} [_defaultConfig] Set a default configuration override for
 * every invocation of the resulting formatter
 *
 * @returns {function} This returns a formatter function that obeys the locale
 * and default configuration rules
 */
function ListPattern(cldrData, _defaultConfig) {
  var formatter = listPatternFormatter;

  var context = {
    __cldr__: extractListPatterns(cldrData),
    __config__: Object.assign(
      {
        patternType: DEFAULT_LIST_PATTERN
      },
      _defaultConfig || {}
    )
  };

  // Return a bound function with the correct context
  var result = formatter.bind(context);

  // For tests sry…
  result.__cldr__ = context.__cldr__;
  result.__config__ = context.__config__;

  return result;
}

module.exports = ListPattern;
