"use strict";
import {tokenizer as tokenize, parse, Parser, plugins} from '../dist/acorn.js';
import {inspect} from 'util';
import {readFileSync as read} from 'fs';
import {generate} from 'escodegen';
import {resolve} from 'path';
var code = read(resolve('./test/tests.sj'), 'utf-8');
var ast;
var tokens;
var generated;
plugins.debug = function (instance) {
  Object.keys(Parser.prototype).filter(function (v) {return v !== 'extend';}).forEach(function (v) {
    instance.extend(v, function (next) {
      return function (...args) {
        console.log(v + ':', ...args);
        var res = next.call(this, ...args);
        console.log(v, 'returned:', res);
        return res;
      }
    })
  })
};
try {
  tokens = [...tokenize(code, {
    plugins: {
      debug: true
    }
  })]
  ast = parse(code, {
    plugins: {
      debug: true
    }
  })
  ast && (generated = generate(ast))
} catch (e) {
  console.error('Test failed\t(Error:', e + ').');
}
tokens && console.log('Tokens:', tokens);
ast && console.log('AST:', inspect(ast, {depth:30}));
generated && console.log('Generated:', generated);