var ListPattern = require('./index');
var MockConfig = require('./mock/config');

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
