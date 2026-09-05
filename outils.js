/* --- Copier textarea ---*/
function copyTextarea(id, btn) {
    var code = document.getElementById(id);
    var temp = document.createElement("textarea");
    temp.value = code.value;
    document.body.appendChild(temp);
    temp.select();
    try { document.execCommand("copy"); } catch (err) {}
    document.body.removeChild(temp);
    btn.focus();
}
var mapTextarea = {
    copyinput: 'input',
    copyoutput: 'output',
    copyCustomPlus: 'importCustomPlusText',
    copyFancyCustomPlus: 'importFancyCustomPlusText',
    copyjson: 'json',
    copyview: 'view',
    copyasciiTextArea: 'asciiTextArea',
    copyhtmlCode: 'htmlCode'
};
Object.keys(mapTextarea).forEach(function(btnId) {
    var el = document.getElementById(btnId);
    if (!el) return; // ignore proprement si absent
    el.onclick = function(e) {
        copyTextarea(mapTextarea[btnId], e.target);
    };
});
/* --- Glisser-déposer textarea ---*/
function setupDragDrop(textareaId) {
    var area = document.getElementById(textareaId);
    if (!area) return; // ignore proprement si absent
    area.addEventListener("dragover", function(e) {
        if (e.dataTransfer.types &&
            (e.dataTransfer.types.indexOf("Files") !== -1 ||
             e.dataTransfer.types.indexOf("application/x-moz-file") !== -1)) {
            e.preventDefault();
        }
    });
    area.addEventListener("drop", function(e) {
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            e.preventDefault();
            var f = e.dataTransfer.files[0];
            var reader = new FileReader();
            reader.onload = function(ev) {
                area.value = ev.target.result;
            };
            reader.readAsText(f);
            return;
        }
    });
}
setupDragDrop("input");
setupDragDrop("output");
setupDragDrop("text");
setupDragDrop("textA");
setupDragDrop("textB");
setupDragDrop("view");
setupDragDrop("textInput");
setupDragDrop("importBox");
/* --- Sélecteur de fichiers importer textarea ---*/
function importTextareaFile(fileInputId, textareaId) {
    var file = document.getElementById(fileInputId);
    var area = document.getElementById(textareaId);
    // Si un des éléments n'existe pas → on ignore proprement
    if (!file || !area) return;
    // Input fichier → lit le fichier et le met dans le textarea
    file.addEventListener("change", function () {
        var f = this.files[0];
        if (!f) return;
        var reader = new FileReader();
        reader.onload = function (e) {
            area.value = e.target.result;
        };
        reader.readAsText(f);
    });
}
importTextareaFile("textareaFileinput", "input");
importTextareaFile("textareaFileoutput", "output");
importTextareaFile("textareaFileimportBox", "importBox");
importTextareaFile("textareaFileview", "view");
importTextareaFile("textareaFiletext", "text");
importTextareaFile("textareaFiletextA", "textA");
importTextareaFile("textareaFiletextB", "textB");
/* --- Boutons - et + sliders ---*/
var sliders = {
    zoomRange: ["applyZoomRange", 1],
    imgScale: ["zoomImage", 5],
    zoomInput: ["applyZoom", 25],
    sizeInput: ["sizeInput", 1],
    dottedGapInput: ["dottedGapValue", 1],
    polygonSidesInput: ["polygonSidesInput", 1],
    starBranchesInput: ["starBranchesInput", 1]
};
var sliderLabels = {
    sizeInput: "sizeLabel",
    dottedGapInput: "dottedGapLabel",
    polygonSidesInput: "polygonSidesLabel",
    starBranchesInput: "starBranchesLabel"
};
function changeSlider(id, amount) {
    var slider = document.getElementById(id);
    if (!slider) return;
    var value = parseInt(slider.value, 10);
    var min = parseInt(slider.min, 10);
    var max = parseInt(slider.max, 10);
    value += amount;
    if (value < min) value = min;
    if (value > max) value = max;
    slider.value = value;
    if (sliderLabels[id]) {
        document.getElementById(sliderLabels[id]).textContent = value;
    }
    if (sliders[id] && typeof window[sliders[id][0]] === "function") {
        window[sliders[id][0]](value);
    }
}
var sliderEvent = ("PointerEvent" in window) ? "pointerup" : "click";
document.addEventListener(sliderEvent, function(e) {
    var action = e.target.getAttribute("data-action");
    if (!action) return;
    var parts = action.match(/^(.*)(Minus|Plus)$/);
    if (!parts) return;
    var id = parts[1];
    if (!sliders[id]) return;
    var amount = parts[2] === "Minus"
        ? -sliders[id][1]
        : sliders[id][1];
    changeSlider(id, amount);
});
