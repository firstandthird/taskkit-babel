import Domodule from 'domodule';
import Codemirror from 'codemirror';
import Complete from '@firstandthird/complete';
import { ready } from 'domassist';
import bestNumber from './commonjs';
console.log(bestNumber);
class Test {

}
const test = new Test();
import { foo, bar } from './lib';
const a = foo();
console.log(a);
ready(() => {
  console.log('ready!');
  console.log(Complete);
});
