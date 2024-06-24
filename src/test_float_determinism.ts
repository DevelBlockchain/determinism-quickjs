import { getQuickJS } from "quickjs-emscripten";
import fs from 'fs';

const code = fs.readFileSync('./src/determinism_float_test.js', 'utf8');

const APPLE = "1.4868647564593032e+44"
const QUICKJS = "1.4868647564592923e+44"

const main = async () => {
    const quickjs = await getQuickJS();
    const vm = quickjs.newContext();

    const result = eval(code).toString();

    const res = vm.unwrapResult(vm.evalCode(code));
    const resultQS = vm.dump(res).toString();
    res.dispose();

    vm.dispose();

    console.log(`In apple silicon:\n- expected: ${APPLE}\n- received: ${result}\n- equal: ${result == APPLE}\n`);
    console.log(`In quickjs-emscripten:\n- expected: ${QUICKJS}\n- received: ${resultQS}\n- equal: ${resultQS == QUICKJS}\n`);
}

main();

/* EXPECTED CONSOLE

In apple silicon:
- expected: 1.4868647564593032e+44
- received: 1.4868647564593032e+44
- equal: true

In quickjs-emscripten:
- expected: 1.4868647564592923e+44
- received: 1.4868647564592923e+44
- equal: true

 */