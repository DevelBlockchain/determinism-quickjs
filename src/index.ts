import fs from 'fs';
import {
    newQuickJSWASMModule,
    newQuickJSAsyncWASMModule,
    RELEASE_SYNC,
    RELEASE_ASYNC,
} from "quickjs-emscripten";
import * as WASM_SYNC from "@jitl/quickjs-wasmfile-release-sync";
import * as WASM_NG_SYNC from "@jitl/quickjs-ng-wasmfile-release-sync";
import * as SINGLEFILE_CJS_SYNC from "@jitl/quickjs-singlefile-cjs-release-sync";
import * as WASM_ASYNC from "@jitl/quickjs-wasmfile-release-asyncify";
import * as WASM_NG_ASYNC from "@jitl/quickjs-ng-wasmfile-release-asyncify";
import * as SINGLEFILE_CJS_ASYNC from "@jitl/quickjs-singlefile-cjs-release-asyncify";

const TEST_CODE = fs.readFileSync('src/test.js', 'utf8');

const main = async () => {
    try {
        eval(TEST_CODE);
    } catch (err: any) {
        console.log("nodejs not deterministic. Error: ", err)
    }

    const QuickJSReleaseSync = await newQuickJSWASMModule(RELEASE_SYNC);
    const QuickJSReleaseAsync = await newQuickJSAsyncWASMModule(RELEASE_ASYNC);

    const QuickJSWASMSync = await newQuickJSWASMModule(WASM_SYNC.default);
    const QuickJSWASMNGSync = await newQuickJSWASMModule(WASM_NG_SYNC.default);
    const QuickJSINGLEFILESync = await newQuickJSWASMModule(SINGLEFILE_CJS_SYNC.default);

    const QuickJSWASMAsync = await newQuickJSAsyncWASMModule(WASM_ASYNC.default);
    const QuickJSWASMNGAsync = await newQuickJSAsyncWASMModule(WASM_NG_ASYNC.default);
    const QuickJSINGLEFILEAsync = await newQuickJSAsyncWASMModule(SINGLEFILE_CJS_ASYNC.default);

    for (const quickjs of [
        QuickJSReleaseSync,
        QuickJSReleaseAsync,
        QuickJSWASMSync,
        QuickJSWASMNGSync,
        QuickJSINGLEFILESync,
        QuickJSWASMAsync,
        QuickJSWASMNGAsync,
        QuickJSINGLEFILEAsync,
    ]) {
        const vm = quickjs.newContext();
        const result = vm.evalCode(TEST_CODE);
        if (result.error) {
            const errorMessage = vm.dump(result.error);
            result.error.dispose();
            vm.dispose();
            console.log("quickjs not deterministic. Error: ", errorMessage);
        } else {
            vm.unwrapResult(result).dispose();
            vm.dispose();
        }
    }
}

main();
