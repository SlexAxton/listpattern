var ListPattern = require('./index');
var MockConfig = require('./mock/config');
var MockData = {
  animals1: ['lions'],
  animals2: ['lions', 'tigers'],
  animals3: ['lions', 'tigers', 'bears'],
  animals4: ['lions', 'tigers', 'bears', 'sharks'],
  animals5: ['lions', 'tigers', 'bears', 'sharks', 'llamas'],
  animals10: [
    'lions',
    'tigers',
    'bears',
    'sharks',
    'llamas',
    'zebras',
    'chimps',
    'hedgehogs',
    'owls',
    'wolves'
  ]
};

describe('Setup', function() {
  test('Configuration object is stored', function() {
    var formatter = ListPattern(MockConfig.test);
    expect(formatter).toHaveProperty('__cldr__');
    expect(formatter).toHaveProperty('__config__');
  });

  test('CLDR config is stored without CLDR fanfare', function() {
    var formatterWithFanfare = ListPattern(MockConfig.test);
    expect(formatterWithFanfare.__cldr__).toHaveProperty(
      'listPattern-type-standard'
    );
  });

  test('Non-CLDR config is stored the same as CLDR object', function() {
    var formatterWithoutFanfare = ListPattern(
      MockConfig.test.main.test.listPatterns
    );
    expect(formatterWithoutFanfare.__cldr__).toHaveProperty(
      'listPattern-type-standard'
    );
  });

  test('Default config is stored', function() {
    var formatter = ListPattern(MockConfig.test);
    expect(formatter.__config__).toHaveProperty('patternType');
    expect(formatter.__config__.patternType).toBe('standard');
  });

  test('Default config overrides are stored', function() {
    var formatter = ListPattern(MockConfig.test, {
      patternType: 'or'
    });
    expect(formatter.__config__).toHaveProperty('patternType');
    expect(formatter.__config__.patternType).toBe('or');
  });
});

describe('Formatting', function() {
  test('Formats a a list of 0 items', function() {
    var formatter = ListPattern(MockConfig.test);
    expect(formatter([])).toBe('');
  });

  test('Formats a a list of 1 item', function() {
    var formatter = ListPattern(MockConfig.test);
    expect(formatter(MockData.animals1)).toBe('lions');
  });

  test('Formats a list of exactly 2', function() {
    var formatter = ListPattern(MockConfig.test);
    expect(formatter(MockData.animals2)).toBe('lions and tigers');
  });

  test('Formats a list of 3', function() {
    var formatter = ListPattern(MockConfig.test);
    expect(formatter(MockData.animals3)).toBe('lions, tigers, and bears');
  });

  test('Formats a list of 4', function() {
    var formatter = ListPattern(MockConfig.test);
    expect(formatter(MockData.animals4)).toBe(
      'lions, tigers, bears, and sharks'
    );
  });

  test('Formats a list of 5', function() {
    var formatter = ListPattern(MockConfig.test);
    expect(formatter(MockData.animals5)).toBe(
      'lions, tigers, bears, sharks, and llamas'
    );
  });

  test('Formats a list of 10', function() {
    var formatter = ListPattern(MockConfig.test);
    expect(formatter(MockData.animals10)).toBe(
      'lions, tigers, bears, sharks, llamas, zebras, chimps, hedgehogs, owls, and wolves'
    );
  });
});
