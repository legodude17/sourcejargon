// ## Token types

// The assignment of fine-grained, information-carrying type objects
// allows the tokenizer to store the information it has about a
// token in a way that is very cheap for the parser to look up.

// All token type variables start with an underscore, to make them
// easy to recognize.

// The `beforeExpr` property is used to disambiguate between regular
// expressions and divisions. It is set on all token types that can
// be followed by an expression (thus, a slash after them would be a
// regular expression).
//
// The `startsExpr` property is used to check if the token ends a
// `yield` expression. It is set on all token types that either can
// directly start an expression (like a quotation mark) or can
// continue an expression (like the body of a string).

// `isLoop` marks a keyword as starting a loop, which is important
// to know when parsing a label, in order to allow or disallow
// continue jumps to that label.

export class TokenType {
  constructor(label, conf = {}) {
    this.label = label
    this.keyword = conf.keyword
    this.beforeExpr = !!conf.beforeExpr
    this.startsExpr = !!conf.startsExpr
    this.isLoop = !!conf.isLoop
    this.isAssign = !!conf.isAssign
    this.prefix = !!conf.prefix
    this.postfix = !!conf.postfix
    this.binop = conf.binop || null
    this.updateContext = null
  }
}

function binop(name, prec) {
  return new TokenType(name, {beforeExpr: true, binop: prec})
}
const beforeExpr = {beforeExpr: true}, startsExpr = {startsExpr: true}

export const types = {
  num: new TokenType("num", startsExpr),
  regexp: new TokenType("regexp", startsExpr),
  string: new TokenType("string", startsExpr),
  name: new TokenType("name", startsExpr),
  eof: new TokenType("eof"),

  // Punctuation token types.
  bracketL: new TokenType("[", {beforeExpr: true, startsExpr: true}),
  bracketR: new TokenType("]"),
  braceL: new TokenType("{", {beforeExpr: true, startsExpr: true}),
  braceR: new TokenType("}"),
  parenL: new TokenType("(", {beforeExpr: true, startsExpr: true}),
  parenR: new TokenType(")"),
  comma: new TokenType(",", beforeExpr),
  semi: new TokenType(";", beforeExpr),
  dot: new TokenType("."),
  question: new TokenType("?", beforeExpr),
  arrow: new TokenType("=>", beforeExpr),
  template: new TokenType("template"),
  ellipsis: new TokenType("...", beforeExpr),
  backQuote: new TokenType("`", startsExpr),
  dollarBraceL: new TokenType("${", {beforeExpr: true, startsExpr: true}),
  at: new TokenType("@"),

  // Operators. These carry several kinds of properties to help the
  // parser use them properly (the presence of these properties is
  // what categorizes them as operators).
  //
  // `binop`, when present, specifies that this operator is a binary
  // operator, and will refer to its precedence.
  //
  // `prefix` and `postfix` mark the operator as a prefix or postfix
  // unary operator.
  //
  // `isAssign` marks all of `=`, `+=`, `-=` etcetera, which act as
  // binary operators with a very low precedence, that should result
  // in AssignmentExpression nodes.

  eq: new TokenType("=", {beforeExpr: true, binop: 6}),
  colon: new TokenType(":", {beforeExpr: true, isAssign: true}),
  coco: new TokenType('::', {isAssing: true, beforeExpr: true}),
  assign: new TokenType('_:', {isAssign: true}),
  incDec: new TokenType("++/--", {prefix: true, postfix: true, startsExpr: true}),
  prefix: new TokenType("prefix", {beforeExpr: true, prefix: true, startsExpr: true}),
  excl: new TokenType("!", {beforeExpr: true, prefix: true, startsExpr: true, isAssign: true}),
  logicalOR: binop("|", 1),
  logicalAND: binop("&", 2),
  equality: binop("==/!=", 6),
  relational: binop("</>", 7),
  plusMin: new TokenType("+/-", {beforeExpr: true, binop: 9, prefix: true, startsExpr: true}),
  modulo: binop("%", 10),
  star: binop("*", 10),
  slash: binop("/", 10),
  caret: new TokenType('^', {binop: 10})
}

// Map keyword names to token types.

export const keywords = {}

// Succinct definitions of keyword token types
function kw(name, options = {}) {
  options.keyword = name
  keywords[name] = types["_" + name] = new TokenType(name, options)
}

kw("break")
kw("case", beforeExpr)
kw("catch")
kw("continue")
kw("debugger")
kw("default", beforeExpr)
kw("do", {isLoop: true, beforeExpr: true})
kw("else", beforeExpr)
kw("finally")
kw("for", {isLoop: true})
kw("function", startsExpr)
kw("if")
kw("return", beforeExpr)
kw("switch")
kw("throw", beforeExpr)
kw("try")
kw("var")
kw("const")
kw("while", {isLoop: true})
kw("with")
kw("new", {beforeExpr: true, startsExpr: true})
kw("this", startsExpr)
kw("super", startsExpr)
kw("class")
kw("extends", beforeExpr)
kw("export")
kw("import")
kw("null", startsExpr)
kw("true", startsExpr)
kw("false", startsExpr)
kw("in", {beforeExpr: true, binop: 7})
kw("instanceof", {beforeExpr: true, binop: 7})
kw("typeof", {beforeExpr: true, prefix: true, startsExpr: true})
kw("void", {beforeExpr: true, prefix: true, startsExpr: true})
kw("delete", {beforeExpr: true, prefix: true, startsExpr: true})