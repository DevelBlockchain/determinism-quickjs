import { getQuickJS } from "quickjs-emscripten";

const code = `
let nan = new Float32Array([0.0 / 0.0, NaN, 0.0, 0.0]);
nan[2] /= nan[1];
nan[3] /= nan[0];
let uint8 = new Uint8Array(nan.buffer);
JSON.stringify(Array.from(uint8));
`;

const main = async () => {
    const quickjs = await getQuickJS();
    const vm = quickjs.newContext();

    const result = eval(code);
    console.log(result);

    const res = vm.unwrapResult(vm.evalCode(code));
    const resultEval = vm.dump(res).toString();
    console.log(resultEval);
    res.dispose();

    // In apple silicon it returns [0, 0, 192, 127, 0, 0, 192, 127, 0, 0, 192, 127, 0, 0, 192, 127].
    // In an amd x86 it returns    [0, 0, 192, 255, 0, 0, 192, 127, 0, 0, 192, 127, 0, 0, 192, 255].

    vm.dispose();

    if(resultEval !== "[0,0,192,127,0,0,192,127,0,0,192,127,0,0,192,127]") {
        throw `not determinist`;
    }
}

main();