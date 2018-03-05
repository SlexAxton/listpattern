# listpattern

This is a single-utility formatter for CLDR listPatterns.

```
npm install --save cldr-listpattern
```

```
yarn add cldr-listpattern
```

## What does it do though?

Formatting a variable list of words into a sentence is simple for a single language. For instance
in English, we can just join everything with commas and add an `, and` for the last element. But
this isn't the case for every language.

```js
// English
['lions', 'tigers', 'bears'] => 'lions, tigers, and bears'
```

vs

```js
// Chinese
['lions', 'tigers', 'bears'] => 'lions、tigers和bears'
```

This tool uses available localization data from the CLDR to allow you to make these types of lists
generically in the locale of your choosing.

## TLDR: Give it the CLDR data, generate a formatter, optionally send config

```js
const ListPattern = require('cldr-listpattern');

// You can use cldr.js to do this for real
const enUsListPatternCLDRData = {…};

const enUsPatternFormatter = new ListPattern(enUsListPatternCLDRData);

const dataList = ['lions', 'tigers', 'bears'];

// Use the 'standard' formatter
enUsPatternFormatter(dataList);

// > "lions, tigers, and bears"

// Optionally, use a different available listPattern
enUsPatternFormatter(dataList, {
  patternType: 'or',
});

// > "lions, tigers, or bears"
```

## CLDR data

You'll probably want to use cldr-js and keep your data up to date, but if you look in the json
CLDR data, you'll see [files like this](https://github.com/unicode-cldr/cldr-misc-modern/blob/master/main/en/listPatterns.json):

```json
{
  "main": {
    "en": {
      "identity": {
        "version": {
          "_number": "$Revision: 13744 $",
          "_cldrVersion": "32.0.1"
        },
        "language": "en"
      },
      "listPatterns": {
        "listPattern-type-standard": {
          "start": "{0}, {1}",
          "middle": "{0}, {1}",
          "end": "{0}, and {1}",
          "2": "{0} and {1}"
        },
        "listPattern-type-or": {
          "start": "{0}, {1}",
          "middle": "{0}, {1}",
          "end": "{0}, or {1}",
          "2": "{0} or {1}"
        },
        "listPattern-type-standard-short": {
          "start": "{0}, {1}",
          "middle": "{0}, {1}",
          "end": "{0}, and {1}",
          "2": "{0} and {1}"
        },
        "listPattern-type-unit": {
          "start": "{0}, {1}",
          "middle": "{0}, {1}",
          "end": "{0}, {1}",
          "2": "{0}, {1}"
        },
        "listPattern-type-unit-narrow": {
          "start": "{0} {1}",
          "middle": "{0} {1}",
          "end": "{0} {1}",
          "2": "{0} {1}"
        },
        "listPattern-type-unit-short": {
          "start": "{0}, {1}",
          "middle": "{0}, {1}",
          "end": "{0}, {1}",
          "2": "{0}, {1}"
        }
      }
    }
  }
}
```

You can either send in that entire object (easier for people using a CLDR tool), or the inner `listPatterns`
object, where the root level keys are each `listPattern-type-<foo>` names (easier for everyone else). We detect
this based on the existence of the `main.<lang>.identity` sub-object.

## Constructor - `ListPattern(<object>locale_data[, <object>default_config>)`

Requiring the `listpattern` module returns a `ListPattern` constructor. It can't do anything until
you generate an instance with CLDR data. It is recommended that you 'memoize' or cache these for each
locale that you need to support.

```js
const ListPattern = require('cldr-listpattern');
const enUsListPatternFormatter = new ListPattern(enCldrData);
```

A common shortening of this technique is to just invoke the constructor directly with the require
statement.

```js
const enUsListPatternFormatter = require('cldr-listpattern')(enCldrData);
```

### Default configuration

The section below details how to send configuration information to the formatter on each invocation
of the formatter, but if you have only a single formatter style that you always override with (or
similar), then you can optionally pass the config as the second argument during the construction
of the formatter.

```js
const enUsListPatternFormatter = require('cldr-listpattern')(enCldrData, {patternType: 'or'});
```

This means that anything you format with `enUsListPattern` going forward will default to the `or`
pattern type, instead of `standard`.

## Configuration - `formatter(<array>list_data[, <object>config])`

### patternType

The CLDR can, but is not required, to define many "types" of list patterns for a single locale. This
might be something like a list that uses `or` instead of `and`. It might be a list of scientific units.
It might be a list that needs to be more compact.

You can set the type of list by invoking the formatter with a configuration object, and setting the
`patternType` parameter to your alternate list type.

```js
enUsPatternFormatter(dataList, {
  patternType: 'or',
});
```

By default, listpattern will render the `standard` list pattern that the cldr defines in the
`listPattern-type-standard` key of the data.

There is no set list of available listPattern formatters, so we will look in your data object for a
key in your initial CLDR data with the name that matches `listPattern-type-<your_config_value>`. If
this formatter doesn't exist for a given locale, it will fall back to the `standard` list pattern.
If you set up a default config object when you instantiated your formatter, it will use the config
there first, and then fall back to `standard`.

#### Author's note

If this fallback behavior is too silent for you, let me know, we could add lifecycle hooks, but
I'm not convinced yet. I'm a little worried that a fallback from an `or` style pattern to an `and`
style pattern will change the meaning of a sentence, not just the 'style'.

## TODO:

I'd love for this to Just Work™ in node by pulling in the CLDR automatically in those cases.

## License

MIT
