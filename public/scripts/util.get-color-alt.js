window.getColorAlt = function pickHex(color1, weight, color) {
    var w1 = (weight === 1 ? 1 : weight - 0.33);
    w1 = w1 < 0 ? 0 : w1;
    w1 = w1 > 1 ? 1 : w1;
    var w2 = 1 - w1;
    w2 = w2 > 1 ? 1 : w2;
    w2 = w2 < 0 ? 0 : w2;
    var rgb = [Math.round(color1[0] * w1 + color[0] * w2),
        Math.round(color1[1] * w1 + color[1] * w2),
        Math.round(color1[2] * w1 + color[2] * w2)];
    return 'rgb(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ');' + (weight === 1 ? 'font-weight: bold' : '');
};
