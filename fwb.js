/**
 * get font baseline
 * @param {Object} dom_element DOM element containing input font sample text
 */
function getBaselineHeight(dom_element){
    var bottom_y = dom_element.getBoundingClientRect().bottom;
    
    var baseline_locator = document.createElement("img");
    dom_element.appendChild(baseline_locator);

    baseline_locator.style.verticalAlign = 'baseline' ;
    var baseline_y = baseline_locator.getBoundingClientRect().bottom;
    dom_element.removeChild(baseline_locator);
        
    return (bottom_y - baseline_y) ;        
}

/**
 * download bitmap font (canvas data)
 * @param {String} font_name 
 */
function downloadFont(font_name) {
    return function () {
        var canvas = document.getElementById('main_canvas');

        var download_link = document.createElement('a');

        download_link.download = font_name.replace(/\'/g, "").replace(/ /g, '_').toLowerCase() + '_bitmap_font.png';
        download_link.href = canvas.toDataURL()
        download_link.click();
    };
}

/**
 * render bitmap font and the sample text result
 * @param {String} name font name
 */
function render(name) {
    var font_sample = document.getElementById("font-sample");

    var baselineHeight = getBaselineHeight(font_sample);

    var font_style_select = document.getElementById('style-select');
    var font_weight_select = document.getElementById('weight-select');
    var font_variant_select = document.getElementById('variant-select');

    var image_width_input = document.getElementById('input_image_width');
    var glyph_size_input = document.getElementById('input_glyph_size');
    var glyph_size_offset_input = document.getElementById('input_glyph_size_offset');
    //var glyph_vert_offset_input = document.getElementById('input_glyph_vert_offset');

    var font_legend = document.getElementById('font_legend');

    var canvas = document.getElementById('main_canvas');
    var canvas_ctx = canvas.getContext('2d');

    var chars_count = 94;

    var first_char_code = 33;
    var glyph_width = parseInt(glyph_size_input.value, 10);
    var glyph_height = glyph_width;

    var font_glyph_size_offset = parseInt(glyph_size_offset_input.value, 10);

    var vertical_offset = baselineHeight + 1;//parseInt(glyph_vert_offset_input.value, 10);

    var canvas_width = parseInt(image_width_input.value, 10);
    var canvas_height = Math.ceil(chars_count / (canvas_width / glyph_width)) * glyph_height;

    canvas.width = canvas_width;
    canvas.height = canvas_height;

    canvas_ctx.mozImageSmoothingEnabled = false;
    canvas_ctx.webkitImageSmoothingEnabled = false;
    canvas_ctx.msImageSmoothingEnabled = false;
    canvas_ctx.imageSmoothingEnabled = false;

    canvas_ctx.fillStyle = 'black';
    canvas_ctx.fillRect(0, 0, canvas_width, canvas_height);

    var font_name = glyph_width + "px '" + name + "'";

    var font_style = font_style_select.options[font_style_select.selectedIndex].value + " " + font_variant_select.options[font_variant_select.selectedIndex].value + " " + font_weight_select.options[font_weight_select.selectedIndex].value + " ";

    canvas_ctx.font = font_style + (glyph_width + font_glyph_size_offset) + "px '" + name + "'";

    canvas_ctx.textBaseline = 'alphabetic';
    canvas_ctx.textAlign = 'center';

    canvas_ctx.strokeStyle = '';

    canvas_ctx.lineWidth = 1;

    var glyph_coord_x = [];
    var glyph_coord_y = [];

    // generate ASCII bitmap font from monospace font
    var i = 0;
    for (i = 0; i < chars_count; i += 1) {
        var gcoord = i * glyph_width;
        var gcoordx = gcoord % canvas_width;
        var gcoordy = Math.floor(gcoord / canvas_width) * glyph_height;

        canvas_ctx.fillStyle = 'white';
        canvas_ctx.fillText(String.fromCharCode(first_char_code + i), gcoordx + glyph_width / 2, gcoordy + glyph_height / 2 + vertical_offset);

        //canvas_ctx.strokeStyle = 'white';
        //canvas_ctx.strokeRect(gcoordx, gcoordy, glyph_width, glyph_height);

        // build glyphs coord. lookup table
        glyph_coord_x[i] = gcoordx;
        glyph_coord_y[i] = gcoordy;
    }

    font_legend.innerHTML = font_name + " ASCII Bitmap";

    // test resulting bitmap font
    var test_canvas = document.getElementById('test_canvas');
    var test_canvas_ctx = test_canvas.getContext('2d');

    test_canvas.width = canvas_width;
    test_canvas.height = glyph_height * 4;

    test_canvas_ctx.fillStyle = 'black';
    test_canvas_ctx.fillRect(0, 0, test_canvas.width, test_canvas.height);

    var sample_text = "Sample text...\n...text sample";
    var sample_text_length = sample_text.length;

    var c = 0;
    var y = 0;

    // font rendering code
    for (i = 0; i < sample_text_length; i += 1) {
        var char = sample_text.charAt(i);
        var glyph = sample_text.charCodeAt(i);

        if (char === ' ') {
            c += 1;

            continue;
        }

        if (char === '\n') {
            c = 0;
            y += glyph_height;

            continue;
        }

        var font_glyph = glyph - first_char_code;

        var gcoordx = glyph_coord_x[font_glyph];
        var gcoordy = glyph_coord_y[font_glyph];

        var glyph_data = canvas_ctx.getImageData(gcoordx, gcoordy, glyph_width, glyph_height);

        test_canvas_ctx.putImageData(glyph_data, (test_canvas.width / 2 - (14 * glyph_width / 2)) + c * glyph_width, test_canvas.height / 2 - glyph_height / 2 * 2 + y);
        
        c += 1;
    }

    // add listener
    var download_button = document.getElementById("download_font");

    download_button.removeEventListener('click', window.download_function);
    window.download_function = downloadFont(font_name);
    download_button.addEventListener('click', window.download_function);

    font_sample.style.fontSize = glyph_size_input.value + "px";
}

function fwb() {
    var font_load = document.getElementById("font_load");
    var font_load_error = document.getElementById("font_load_error");

    var font_name_input = document.getElementById("input_font_name");

    var glyph_size_input = document.getElementById('input_glyph_size');
    var font_sample = document.getElementById("font-sample");
    font_sample.style.fontFamily = font_name_input.value;
    font_sample.style.fontSize = glyph_size_input.value + "px";

    font_load.style.display = "block";

    WebFont.load({
        google: {
            families: [font_name_input.value]
        },
        active: function () {
            font_load.style.display = "none";

            font_load_error.innerHTML = "";

            render(font_name_input.value);
        },
        inactive: function () {
            // try adobe
            WebFont.load({
                typekit: {
                    id: font_name_input.value,
                    api: '//use.edgefonts.net'
                },
                active: function () {
                    font_load.style.display = "none";

                    font_load_error.innerHTML = "";
        
                    render(font_name_input.value);
                },
                inactive: function () {
                    font_load.style.display = "none";
                    font_load_error.innerHTML = "Could not load this font. Check font name ?";
                }
            })
        }
    });
}

/**
 * function called at regular interval to compute font baseline & trigger a bitmap font render if there is any change
 */
function update() {
    var font_name_input = document.getElementById("input_font_name");

    //var baseline = document.getElementById("font-sample-baseline");
    var font_sample = document.getElementById("font-sample");
    var baselineHeight = getBaselineHeight(font_sample);
    //var newLinePos = font_sample.getBoundingClientRect().bottom - baselineHeight ;
    //baseline.style.top = newLinePos + "px" ;

    if (window.previousBaselineHeight !== baselineHeight) {
        render(font_name_input.value);
    }

    window.previousBaselineHeight = baselineHeight;
}

window.onload = function () {
    var font_name_input = document.getElementById("input_font_name");
    font_name_input.addEventListener("blur", fwb);

    var font_style_select = document.getElementById('style-select');
    var font_weight_select = document.getElementById('weight-select');
    var font_variant_select = document.getElementById('variant-select');

    var image_width_input = document.getElementById('input_image_width');
    var glyph_size_input = document.getElementById('input_glyph_size');
    var glyph_size_offset_input = document.getElementById('input_glyph_size_offset');
    //var glyph_vert_offset_input = document.getElementById('input_glyph_vert_offset');

    font_style_select.addEventListener("change", function () {
        render(font_name_input.value);
    });

    font_weight_select.addEventListener("change", function () {
        render(font_name_input.value);
    });

    font_variant_select.addEventListener("change", function () {
        render(font_name_input.value);
    });

    glyph_size_input.addEventListener("change", function () {
        render(font_name_input.value);
    });

    glyph_size_offset_input.addEventListener("change", function () {
        render(font_name_input.value);
    });
/*
    glyph_vert_offset_input.addEventListener("change", function () {
        render(font_name_input.value);
    });
*/
    image_width_input.addEventListener("change", function () {
        render(font_name_input.value);
    });

    window.setInterval(update, 2000);

    fwb();
};