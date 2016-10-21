import test from 'ava';

const hookModule = require('./');

test('Create hook', t => {
  const h1 = new hookModule.Hook({});
  t.is(h1.isHook(h1), true, 'Hook is a hook.');
});

test('Create anchor', t => {
  const a1 = new hookModule.Anchor({});
  t.is(a1.isHook(a1), true, 'Anchor is a hook.');
});

test('Set hook', t => {
  const h1 = new hookModule.Hook({});
  const a1 = new hookModule.Anchor({});
  a1.setHook(h1);
  t.is(a1.isHook(a1.hook), true, 'Anchor\'s hook is a hook.');
});

test('Set hook returns a hook', t => {
  const h1 = new hookModule.Hook({});
  const a1 = new hookModule.Anchor({});
  t.is(a1.isHook(a1.setHook(h1)), true, 'setHook() returns a hook.');
});
