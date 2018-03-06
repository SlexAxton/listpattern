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
  describe('No config', function() {
    var formatter;

    beforeEach(function() {
      formatter = ListPattern(MockConfig.test);
    });

    test('Formats a a list of 0 items', function() {
      expect(formatter([])).toBe('');
    });

    test('Formats a a list of 1 item', function() {
      expect(formatter(MockData.animals1)).toBe('lions');
    });

    test('Formats a list of exactly 2', function() {
      expect(formatter(MockData.animals2)).toBe('lions and tigers');
    });

    test('Formats a list of 3', function() {
      expect(formatter(MockData.animals3)).toBe('lions, tigers, and bears');
    });

    test('Formats a list of 4', function() {
      expect(formatter(MockData.animals4)).toBe(
        'lions, tigers, bears, and sharks'
      );
    });

    test('Formats a list of 5', function() {
      expect(formatter(MockData.animals5)).toBe(
        'lions, tigers, bears, sharks, and llamas'
      );
    });

    test('Formats a list of 10', function() {
      expect(formatter(MockData.animals10)).toBe(
        'lions, tigers, bears, sharks, llamas, zebras, chimps, hedgehogs, owls, and wolves'
      );
    });
  });

  describe('With default config', function() {
    var formatter;

    beforeEach(function() {
      formatter = ListPattern(MockConfig.test, {
        patternType: 'or'
      });
    });

    test('Formats a a list of 0 items', function() {
      expect(formatter([])).toBe('');
    });

    test('Formats a a list of 1 item', function() {
      expect(formatter(MockData.animals1)).toBe('lions');
    });

    test('Formats a list of exactly 2', function() {
      expect(formatter(MockData.animals2)).toBe('lions or tigers');
    });

    test('Formats a list of 3', function() {
      expect(formatter(MockData.animals3)).toBe('lions, tigers, or bears');
    });

    test('Formats a list of 4', function() {
      expect(formatter(MockData.animals4)).toBe(
        'lions, tigers, bears, or sharks'
      );
    });

    test('Formats a list of 5', function() {
      expect(formatter(MockData.animals5)).toBe(
        'lions, tigers, bears, sharks, or llamas'
      );
    });

    test('Formats a list of 10', function() {
      expect(formatter(MockData.animals10)).toBe(
        'lions, tigers, bears, sharks, llamas, zebras, chimps, hedgehogs, owls, or wolves'
      );
    });
  });

  describe('With default config - uncommon pattern type', function() {
    var formatter;

    beforeEach(function() {
      formatter = ListPattern(MockConfig.test, {
        patternType: 'unit-narrow'
      });
    });

    test('Formats a a list of 0 items', function() {
      expect(formatter([])).toBe('');
    });

    test('Formats a a list of 1 item', function() {
      expect(formatter(MockData.animals1)).toBe('lions');
    });

    test('Formats a list of exactly 2', function() {
      expect(formatter(MockData.animals2)).toBe('lions tigers');
    });

    test('Formats a list of 3', function() {
      expect(formatter(MockData.animals3)).toBe('lions tigers bears');
    });

    test('Formats a list of 4', function() {
      expect(formatter(MockData.animals4)).toBe('lions tigers bears sharks');
    });

    test('Formats a list of 5', function() {
      expect(formatter(MockData.animals5)).toBe(
        'lions tigers bears sharks llamas'
      );
    });

    test('Formats a list of 10', function() {
      expect(formatter(MockData.animals10)).toBe(
        'lions tigers bears sharks llamas zebras chimps hedgehogs owls wolves'
      );
    });
  });

  describe('With default config - non-latin characters', function() {
    var formatter;

    beforeEach(function() {
      formatter = ListPattern(MockConfig.test, {
        patternType: 'chinese'
      });
    });

    test('Formats a a list of 0 items', function() {
      expect(formatter([])).toBe('');
    });

    test('Formats a a list of 1 item', function() {
      expect(formatter(MockData.animals1)).toBe('lions');
    });

    test('Formats a list of exactly 2', function() {
      expect(formatter(MockData.animals2)).toBe('lions和tigers');
    });

    test('Formats a list of 3', function() {
      expect(formatter(MockData.animals3)).toBe('lions、tigers和bears');
    });

    test('Formats a list of 4', function() {
      expect(formatter(MockData.animals4)).toBe('lions、tigers、bears和sharks');
    });

    test('Formats a list of 5', function() {
      expect(formatter(MockData.animals5)).toBe(
        'lions、tigers、bears、sharks和llamas'
      );
    });

    test('Formats a list of 10', function() {
      expect(formatter(MockData.animals10)).toBe(
        'lions、tigers、bears、sharks、llamas、zebras、chimps、hedgehogs、owls和wolves'
      );
    });
  });

  describe('With invidual config and invalid default', function() {
    var formatter;

    beforeEach(function() {
      formatter = ListPattern(MockConfig.test, {
        patternType: 'doesnt-exist'
      });
    });

    test('Formats a a list of 0 items', function() {
      expect(formatter([])).toBe('');
    });

    test('Formats a a list of 1 item', function() {
      expect(formatter(MockData.animals1)).toBe('lions');
    });

    test('Formats a list of exactly 2', function() {
      expect(formatter(MockData.animals2)).toBe('lions and tigers');
      expect(
        formatter(MockData.animals2, {
          patternType: 'or'
        })
      ).toBe('lions or tigers');
    });

    test('Formats a list of 3', function() {
      expect(formatter(MockData.animals3)).toBe('lions, tigers, and bears');
      expect(
        formatter(MockData.animals3, {
          patternType: 'or'
        })
      ).toBe('lions, tigers, or bears');
    });

    test('Formats a list of 4', function() {
      expect(formatter(MockData.animals4)).toBe(
        'lions, tigers, bears, and sharks'
      );
      expect(
        formatter(MockData.animals4, {
          patternType: 'or'
        })
      ).toBe('lions, tigers, bears, or sharks');
    });

    test('Formats a list of 5', function() {
      expect(formatter(MockData.animals5)).toBe(
        'lions, tigers, bears, sharks, and llamas'
      );
      expect(
        formatter(MockData.animals5, {
          patternType: 'or'
        })
      ).toBe('lions, tigers, bears, sharks, or llamas');
    });

    test('Formats a list of 10', function() {
      expect(formatter(MockData.animals10)).toBe(
        'lions, tigers, bears, sharks, llamas, zebras, chimps, hedgehogs, owls, and wolves'
      );
      expect(
        formatter(MockData.animals10, {
          patternType: 'or'
        })
      ).toBe(
        'lions, tigers, bears, sharks, llamas, zebras, chimps, hedgehogs, owls, or wolves'
      );
    });
  });
});
