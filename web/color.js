LIGHT_FUCHSIA_PINK   = [247, 247, 134];
ULTRA_PINK           = [255, 242, 110];
BANANA_MANIA         = [251, 176, 243];
DANDELION            = [244, 46 , 227];
CEIL                 = [192, 222, 208];
BLUE_YONDER          = [ 66, 165, 166];
VERDIGRIS            = [ 67, 181, 164];
PALE_PINK            = [255, 214, 210];
SUNSET_ORANGE        = [253, 92 ,  82];
COLUMBIA_BLUE        = [192, 222, 208];

const allColors = [ BANANA_MANIA,DANDELION,
                    COLUMBIA_BLUE, BLUE_YONDER,
                    CEIL, VERDIGRIS,
                    PALE_PINK,SUNSET_ORANGE,
                    LIGHT_FUCHSIA_PINK,ULTRA_PINK,
];

const nbColor = allColors.length;

function chooseColor() {
    let r = int(random(0, nbColor));
    return allColors[r];
}
