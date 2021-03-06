import { noop } from 'lodash';

import mappr from '../lib/core';

// fixture

const source = {
  gender: 'male',
  firstName: 'Dieter',
  middleName: 'moeriki',
  lastName: 'Luypaert',
  address: {
    city: 'Laken',
    street: 'Rue Mode Vliebergh',
    streetNumber: '18',
  },
  country: 'Belgium',
};

// private

function setupAndTest() {
  // setup
  const mapper = mappr({
    'gender': 1,
    'name': {
      first: 'firstName',
      last: 'lastName',
    },
    'name.middle': 'middleName',
    'city': 'address.city',
    'address': { street: (_source) => `${_source.address.street} ${_source.address.streetNumber}` },
    'country': true,
  });
  // test
  return mapper(source);
}

// tests

it('should map root level property', () => {
  // setup & test
  const result = setupAndTest();
  // verify
  expect(result.gender).toBe('male');
});

it('should not map undefined', () => {
  // setup & test
  const result = setupAndTest();
  // verify
  expect(result.province).toBeUndefined();
  expect('province' in result).toBe(false);
});

it('should map root level property to nested property', () => {
  // setup & test
  const result = setupAndTest();
  // verify
  expect(result.name.first).toBe('Dieter');
  expect(result.name.last).toBe('Luypaert');
});

it('should map property to single-notation nested property', () => {
  // setup & test
  const result = setupAndTest();
  // verify
  expect(result.name.middle).toBe('moeriki');
});

it('should map nested property to root level property', () => {
  // setup & test
  const result = setupAndTest();
  // verify
  expect(result.city).toBe('Laken');
});

it('should map using custom mapper', () => {
  // setup & test
  const result = setupAndTest();
  // verify
  expect(result.address.street).toBe('Rue Mode Vliebergh 18');
});

it('should pick properties', () => {
  // setup & test
  const result = setupAndTest();
  // verify
  expect(result.gender).toBe('male');
  expect(result.country).toBe('Belgium');
});

it('should throw if mapper is no function|object|string|true|1', () => {
  // setup
  const mapper = mappr({ key: 42 }); // true is not a valid mapper
  // test
  const test = () => mapper({});
  // verify
  expect(test).toThrow();
});

it('should apply multiple formatters', () => {
  // setup
  const user = { name: 'John H. Benjamin' };
  const mapper = mappr(
    'name',
    (name) => name.toUpperCase(),
    (name) => name.split('').reverse().join(''),
  );
  // test
  const name = mapper(user);
  // verify
  expect(name).toBe('NIMAJNEB .H NHOJ');
});

describe('load()', () => {

  it('should load plugin', () => {
    // setup
    const myPlugin = () => noop;
    // test
    mappr.load('myPlugin', myPlugin);
    // verify
    expect(mappr.myPlugin).toBe(noop);
  });

  it('should throw trying to overload existing plugin', () => {
    // setup
    mappr.load('compose', () => noop);
    // test
    const test = () => mappr.load('compose', noop);
    // verify
    expect(test).toThrow();
  });

});
