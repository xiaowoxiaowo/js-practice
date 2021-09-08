function ObjectCreate(proto, properties) {
  function F() {};
  F.prototype = proto;
  if(properties) {
      Object.defineProperty(F, properties);
  }
  return new F();
};