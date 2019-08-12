"use strict";
var N = 1000;
var phrate = 10;
var tr = 0.02;
var vth = 0.5;
var t = nj.arange(N);
var play = true;
var flag_vth = false;
var flag_new = true;
var flag_CH1 = true;
var flag_CH2 = false;
var run_single = false;
//main spad results
var y_spad;
var sw_y = document.getElementById("sw_y");
//plot data
var canv = document.getElementById("display");
canv.width = 1000;
canv.height = 400;
var gr = new GR("display");
gr.setviewport(0, 1, 0, 1);
gr.setwindow(1, 1000, 0, 1);
var y = nj.arange(1000);
//gr.polyline(1000, tplot, yplot);
var slider_tr = document.getElementById('slider_tr');
var slider_phrate = document.getElementById("slider_phrate");
;
var slider_vth = document.getElementById("slider_vth");
;
noUiSlider.create(slider_tr, {
    start: [0.5],
    connect: [true, false],
    //tooltips: [false, wNumb({decimals: 1}), true],
    range: {
        min: 0.01,
        max: 1
    }
});
noUiSlider.create(slider_phrate, {
    start: [10],
    connect: [true, false],
    //tooltips: [false, wNumb({decimals: 1}), true],
    range: {
        min: 0.1,
        max: 100
    }
});
//slider_vth.style.visibility = "hidden";
slider_vth.setAttribute("disabled", "true");
noUiSlider.create(slider_vth, {
    start: [0.5],
    connect: [true, false],
    //tooltips: [false, wNumb({decimals: 1}), true],
    range: {
        min: 0.01,
        max: 1
    }
});
update_ui();
var spad = new SPAD(1000);
var tplot = spad.t.tolist();
setInterval(function () {
    if (run_single) {
        update(false, true, true);
        run_single = false;
    }
    else {
        if (play) {
            update(true, true, true);
        }
    }
}, 100);
//button function
function ctrl_run() {
    play = true;
    document.getElementById("bt-run").style.backgroundColor = "green";
    document.getElementById("bt-single").style.backgroundColor = "";
}
function ctrl_single() {
    play = false;
    update(true, true, true);
    document.getElementById("bt-run").style.backgroundColor = "green";
    document.getElementById("bt-single").style.backgroundColor = "";
    setTimeout(function () {
        document.getElementById("bt-run").style.backgroundColor = "";
        document.getElementById("bt-single").style.backgroundColor = "red";
    }, 200);
}
slider_tr.noUiSlider.on("update", function (values, handle) {
    tr = parseFloat(values[handle]) / 10;
    document.getElementById("display_tr").innerHTML = tr.toString();
    run_single = true;
});
slider_phrate.noUiSlider.on("update", function (values, handle) {
    phrate = parseFloat(values[handle]);
    document.getElementById("display_phrate").innerHTML = phrate.toString();
    spad.generate_photon(phrate);
    run_single = true;
});
slider_vth.noUiSlider.on("update", function (values, handle) {
    vth = parseFloat(values[handle]);
    document.getElementById("display_vth").innerHTML = vth.toString();
});
slider_vth.noUiSlider.on("start", function (values, handle) {
    //flag_vth = true;
    //flag_new = false;
    //play = true;
    flag_vth = true;
    if (!play) {
        setInterval(function () {
            update(false, false, true);
        }, 100);
    }
});
slider_vth.noUiSlider.on("end", function (values, handle) {
    //flag_vth = false;
    //flag_new = true;
    flag_vth = false;
});
//plot new set
function update(new_photon, ch1, ch2) {
    if (new_photon) {
        spad.generate_photon(phrate);
    }
    gr.clearws();
    if (ch1) {
        spad.update_y(tr);
    }
    if (flag_CH1) {
        gr.setlinecolorind(430);
        gr.polyline(1000, tplot, spad.y.tolist());
    }
    if (ch2) {
        spad.update_ysq(vth);
    }
    if (flag_CH2) {
        gr.setlinecolorind(530);
        gr.polyline(1000, tplot, spad.ysq.tolist());
        if (flag_vth) {
            var y_1 = (nj.ones(1000)).multiply(vth);
            gr.setlinecolorind(550);
            gr.polyline(1000, tplot, y_1.tolist());
        }
    }
}
function update_ui() {
    if (play) {
        document.getElementById("bt-run").style.backgroundColor = "green";
    }
    else {
        document.getElementById("bt-run").style.backgroundColor = "";
    }
    if (flag_CH1) {
        document.getElementById("btCH1").style.backgroundColor = "yellow";
    }
    else {
        document.getElementById("btCH1").style.backgroundColor = "";
    }
    if (flag_CH2) {
        document.getElementById("btCH2").style.backgroundColor = "green";
    }
    else {
        document.getElementById("btCH2").style.backgroundColor = "";
    }
}
// CH functions
function btCH1() {
    var bt = document.getElementById("btCH1");
    if (flag_CH1) {
        flag_CH1 = false;
        bt.style.backgroundColor = "";
    }
    else {
        flag_CH1 = true;
        bt.style.backgroundColor = "Yellow";
    }
}
function btCH2() {
    var bt = document.getElementById("btCH2");
    if (flag_CH2) {
        flag_CH2 = false;
        slider_vth.setAttribute("disabled", "true");
        bt.style.backgroundColor = "";
    }
    else {
        flag_CH2 = true;
        slider_vth.removeAttribute("disabled");
        bt.style.backgroundColor = "lightgreen";
    }
}
