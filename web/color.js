LIGHT_FUCHSIA_PINK   = [249, 132, 239];
ULTRA_PINK           = [255, 111, 255];
BANANA_MANIA         = [255, 255, 0];
DANDELION            = [240, 225, 48];
CIEL                 = [135, 206, 235];
DODGER_BLUE          = [30,144,255];
DARKSEEGREEN         = [143, 188, 143];
PALE_PINK            = [250, 218, 221];
SUNSET_ORANGE        = [253, 94, 83];
COLUMBIA_BLUE        = [155, 221, 255];

const allColors = [ BANANA_MANIA,DANDELION,
                    COLUMBIA_BLUE, DODGER_BLUE,
                    CIEL, DARKSEEGREEN,
                    PALE_PINK,SUNSET_ORANGE,
                    LIGHT_FUCHSIA_PINK,ULTRA_PINK,
];

const nbColor = allColors.length;

function chooseColor() {
    let r = int(random(0, nbColor));
    return allColors[r];
}
