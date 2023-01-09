import * as PIXI from 'pixi.js'

export function createSpritesContainer(textures: PIXI.Texture[][], width?: number, height?: number, tint?: number): PIXI.Container {
    const container = new PIXI.Container();

    //Corner sprites
    const tl = PIXI.Sprite.from(textures[0][0]);
    const tr = PIXI.Sprite.from(textures[0][2]);
    const bl = PIXI.Sprite.from(textures[2][0]);
    const br = PIXI.Sprite.from(textures[2][2]);

    //Top and Bottom sprites
    const t = PIXI.Sprite.from(textures[0][1]);
    const b = PIXI.Sprite.from(textures[2][1]);

    //Left and Right sprites
    const l = PIXI.Sprite.from(textures[1][0]);
    const r = PIXI.Sprite.from(textures[1][2]);

    //Center sprite
    const c = PIXI.Sprite.from(textures[1][1]);

    if (width < tl.width + tr.width) {
        tl.width = width / 2;
        tr.width = width / 2;
        bl.width = width / 2;
        br.width = width / 2;
    }

    if (height < tl.height + tr.height) {
        tl.height = height / 2;
        tr.height = height / 2;
        bl.height = height / 2;
        br.height = height / 2;
    }

    if (width > tl.width + tr.width) {
        t.width = width - (tl.width + tr.width);
        b.width = width - (tl.width + tr.width);

        t.position.set(tl.width, 0);
        b.position.set(bl.width, height - b.height)

        container.addChild(t, b)
    }

    if (height > tl.height + tr.height) {
        l.height = height - (tl.height + tr.height);
        r.height = height - (tl.height + tr.height);

        l.position.set(0, tl.height);
        r.position.set(width - r.width, tr.height)

        container.addChild(l, r)
    }

    if ((width > (tl.width + tr.width)) && (height > (tl.height + bl.height))) {
        c.width = width - (tl.width + tr.width);
        c.height = height - (tl.height + tr.height);

        c.position.set(tl.width, 0 + tr.height);

        container.addChild(c);
    }

    tl.position.set(0, 0);
    tr.position.set(width - tr.width, 0)
    bl.position.set(0, height - bl.height);
    br.position.set(width - br.width, height - br.height);

    if (tint) {
        tl.tint = tint;
        tr.tint = tint;
        bl.tint = tint;
        br.tint = tint;
        t.tint = tint;
        b.tint = tint;
        l.tint = tint;
        r.tint = tint;
        c.tint = tint;
    }

    container.addChild(tl, tr, bl, br);
    return container;
}


export function createTiles(baseTexture: PIXI.BaseTexture): PIXI.Texture[][] {
    //split base texture into 9 textures
    return [
        [
            getTexture(baseTexture, 0, 0, 25, 25),
            getTexture(baseTexture, 25, 0, 80, 25),
            getTexture(baseTexture, 105, 0, 25, 25)
        ],
        [
            getTexture(baseTexture, 0, 25, 25, 80),
            getTexture(baseTexture, 25, 25, 80, 80),
            getTexture(baseTexture, 105, 25, 25, 80)
        ],
        [
            getTexture(baseTexture, 0, 105, 25, 25),
            getTexture(baseTexture, 25, 105, 80, 25),
            getTexture(baseTexture, 105, 105, 25, 25)
        ]
    ]
}

function getTexture(baseTexture: PIXI.BaseTexture, x: number, y: number, w: number, h: number) {
    return new PIXI.Texture(baseTexture, new PIXI.Rectangle(x, y, w, h))
}