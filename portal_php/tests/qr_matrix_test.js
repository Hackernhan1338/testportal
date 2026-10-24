// Run: node tests/qr_matrix_test.js
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const scope={window:{}};vm.createContext(scope);
vm.runInContext(fs.readFileSync(__dirname+'/../assets/vendor/qr-local.js','utf8'),scope);
const qr=scope.window.FocusQR.matrix('https://emotionalplaybox4-0.com/index.php?page=scan&event=123&token=q2.123.1122334.abcdefghijklmnopqrstuv');
assert(qr.getModuleCount()>=25);assert(qr.isDark(0,0));assert(qr.isDark(6,6));
console.log('Local QR matrix test passed:',qr.getModuleCount(),'x',qr.getModuleCount());
