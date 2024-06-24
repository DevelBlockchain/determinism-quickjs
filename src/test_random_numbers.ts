import { QuickJSContext, getQuickJS } from "quickjs-emscripten";

var count = 0;
const test = (vm: QuickJSContext, code: string, a: number, b: number, r: number) => {
    let expected = r.toString();
    let r0 = eval(code).toString();
    if (expected !== r0) {
        count++;
        console.log(`eval diff => "${code}" => expected: "${expected}" result: "${r0}"`);
    }
    const result = vm.unwrapResult(vm.evalCode(code));
    r0 = vm.dump(result).toString();
    if (expected !== r0) {
        count++;
        console.log(`QuickJS.eval diff => "${code}" => expected: "${r}" result: "${r0}"`);
    }
    result.dispose();
}

const main = async () => {
    const quickjs = await getQuickJS();
    const vm = quickjs.newContext();

    for (let i = 0; i < 100000000; i++) {
        let a = Math.random();
        let b0 = Math.random();
        let b1 = Math.random() * Number.MAX_VALUE;
        let b2 = Math.random() * Number.MAX_SAFE_INTEGER;

        let r0 = Math.pow(a, b0);
        let r1 = Math.pow(a, b1);
        let r2 = Math.pow(a, b2);
        test(vm, `Math.pow(${a}, ${b0})`, a, b0, r0);
        test(vm, `Math.pow(${a}, ${b1})`, a, b1, r1);
        test(vm, `Math.pow(${a}, ${b2})`, a, b2, r2);
        
        r0 = Math.sin(b0);
        r1 = Math.sin(b1);
        r2 = Math.sin(b2);
        test(vm, `Math.sin(${b0})`, a, b0, r0);
        test(vm, `Math.sin(${b1})`, a, b1, r1);
        test(vm, `Math.sin(${b2})`, a, b2, r2);
    }
    vm.dispose();
}

main();