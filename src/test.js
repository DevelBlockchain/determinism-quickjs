const test = (received, expected) => {
    received = received.toString()
    if (expected.toString() !== received) throw `wrong result\n- expected: "${expected}"\n- received: "${received}"`;
}

let nan = new Float32Array([0.0 / 0.0, NaN, 0.0, 0.0]);
nan[2] /= nan[1];
nan[3] /= nan[0];
let uint8 = new Uint8Array(nan.buffer);
let result = JSON.stringify(Array.from(uint8));
console.log(result)

test(result, "[0,0,192,127,0,0,192,127,0,0,192,127,0,0,192,127]");

test(1 / 100000, '0.00001');
test(1.0 / 100000, '0.00001');
test(1 / 100000.0, '0.00001');
test(1.0 / 100000.0, '0.00001');
test(Math.sin(0.8132315871201361), '0.7265115628287944');
test(Math.sinh(0.8132315871201361), '0.9058806292334486');
test(Math.cos(0.8132315871201361), '0.6871542396551612');
test(Math.cosh(0.8132315871201361), '1.349303418220079');
test(Math.sqrt(0.8132315871201361), '0.9017935390765095');
test(Math.pow(0.8132315871201361, 0.8712813231501361), '0.8351631877756983');
test(Math.sin(1.587050041036026e+308), "-0.9865558671324967");
test(Math.sin(6100525763005867), "0.7476490903306555");
test(Math.pow(0.4128875409279229, 0.5060192669549024), "0.6391510076399535");
test(Math.pow(0.3994712242666931, 0.21766434640784182), "0.8189504048605325");
test(Math.pow(0.8273905283334133, 0.31105193074621384), "0.9427655537398522");
test(Math.pow(0.7061548634425951, 0.13505558650201088), "0.9540982400483131");
test(Math.pow(0.578299741123641, 0.5274466844821419), "0.7491148171857054");
test(Math.pow(0.1271920619510769, 0.4189644960765544), "0.4215028723395336");
test(0.1 + 0.2, '0.30000000000000004');

// from https://github.com/microsoft/WSL/issues/830
let t = 1.0;
while (1 + t / 2 != 1) {
    t = t / 2;
}
test(t, '2.220446049250313e-16');

let t0, t1 = 1.0;
while (t1 > 0) {
    t0 = t1;
    t1 = t0 / 2;
}
test(t0, '5e-324');
test(t1, '0');

var sqrtfive = Math.sqrt(5);
var phi = (1 + sqrtfive) / 2;
var fibc = function (n) { return Math.round((Math.pow(phi, n)) / sqrtfive); };

var output = 0;
for (var x = 0; x < 100000; x++) {
    output = fibc(75);
    test(output, '2111485077978055');
}
