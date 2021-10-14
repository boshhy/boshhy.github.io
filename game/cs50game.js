kaboom({
    background: [80, 80, 80],
});

// tiles for map
loadSprite("tiles", "/sprites/blue_ground.png", {
    sliceX: 27,
});

loadSprite("door", "/sprites/door.png", {
    sliceX: 2,
    anims: {
        open: { from: 1, to: 1, loop: false },
    }
})


// heart sprite
loadSprite("heart", "/sprites/heart.png", {
    sliceX: 4,
    anims: {
        idle: { from: 0, to: 3, loop: true, speed: 4 },
    }
});

// beam sprite
loadSprite("beam", "/sprites/beam.png", {
    sliceX: 6,
    anims: {
        idle: { from: 0, to: 5, loop: true, speed: 10 },
    }
});

// key sprite
loadSprite("key", "/sprites/key.png", {
    sliceX: 4,
    anims: {
        idle: { from: 0, to: 3, loop: true, speed: 5 },
    }
})


// snake sprite
loadSprite("snake", "/sprites/snake.png", {
    sliceX: 11,
    sliceY: 2,
    anims: {
        idle: { from: 2, to: 3, loop: true, speed: 4 },
        walk: { from: 0, to: 7, loop: true, speed: 10 },
        hurt: { from: 8, to: 8, loop: false },
    },
});

// snake_drop sprite
loadSprite("snake_drop", "/sprites/snake.png", {
    sliceX: 11,
    sliceY: 2,
    anims: {
        idle: { from: 13, to: 14, loop: true, speed: 4 },
        walk: { from: 15, to: 16, loop: true, speed: 10 },
        hurt: { from: 19, to: 19, loop: false },
    },
});

// blue character sprite
loadSprite("blue", "/sprites/blue.png", {
    sliceX: 4,
    sliceY: 7,

    anims: {
        run: { from: 0, to: 1, loop: true, speed: 10, },
        jump: { from: 4, to: 5, loop: false, speed: 1.2, },
        idle: { from: 0, to: 0, loop: true, speed: 10, },
        attack: { from: 2, to: 3, },
        forward: { from: 9, to: 9, },
    }

});

// play this anmation when player dies
loadSprite("player_death", "/sprites/knight_death.png", {
    sliceX: 13,
    sliceY: 2,
    anims: {
        death: { from: 14, to: 25, loop: false, },
    }
})

function sword(x = 0, y = 0, dir = 1, z = 60) {
    mydirection = "left"
    if (dir < 0){
        mydirection = "right"
    }
    const sword = add([
        rect(z, 20),
        opacity(0),
        area(),
        pos(x, y),
        origin(mydirection),
        "sword"
    ]);
    wait(0.1, () => {
        destroy(sword);
    })
}


function patrol(speed = 60, dir = 1) {
	return {
		id: "patrol",
		require: [ "pos", "area", ],
		add() {
			this.on("collide", (obj, side) => {
				if (side === "right") {
					dir = -dir;
					this.flipX(true);
				}
				if (side === "left") {
				    dir = -dir;
				    this.flipX(false);
				}
			},
			this.collides("block", (s) => {
			    dir = -dir;
			    if (dir > 0){
			        this.flipX(false);
			    }
			    else {
			        this.flipX(true);
			    }
			})
			);
		},
		update() {
			this.move(speed * dir, 0);
		},
	};
}

function dropKey(snake) {
	    const key =	add([
            {width: 64, height: 64},
            sprite("key", { anim: "idle" }),
            area({ width: 1,}),
            origin("center"),
            scale(3),
            pos(snake.pos.x, snake.pos.y),
            "key",
        ]);
        return key;
}

function deathLocation(player){
    const playerDeath = add ([
        sprite("player_death", { anim: "death" }),
        origin("center"),
        scale(2.5),
        "player",
        layer("front"),
        pos(player.pos.x, player.pos.y),

    ]);

    return playerDeath
}






scene("start", (levelIndex) => {

    const levels = [
    [
        "                                    ",
        "          t                         ",
        "          g                         ",
        "                               q    ",
        "          p                    d    ",
        "  <================================>",
        "       i                            ",
    ],
    [
        "  a                 a     ",
        "  b                 b     ",
        "  b        w        b     ",
        "  b                 b     ",
        "  b   k    p    d   b     ",
        "<=========================>",
    ],
    [
        "                          ",
        "                          ",
        "    e         k      d    ",
        "              a     [=]   ",
        "    p   a     b     bbb   ",
        "<==========================>",


    ],

    [   "                       y           ",
        "                  d         k      ",
        "             y  <===>     <===>    ",
        "                                   ",
        "    r      a                       ",
        "           b                       ",
        "    p      b                       ",
        "<==================================>",
    ],
    [
        "                              ",
        "                              ",
        "                        o     ",
        "   u                          ",
        "         8  s  8     8  z  8  ",
        "   p      [===]   d   [===]   ",
        "<============================>",
    ],
    [
        "            j                 ",
        "   l                          ",
        "         8 sks 8        d     ",
        "   p  h   [===]   h   [===]   ",
        "<============================>",
    ],
    [
        "           [=======]   ",
        "           bb-   +bb   ",
        "           bbk   6bb   ",
        "           bb=====bb   ",
        "           bbbbbbbbb   ",
        "           bb-   +bb   ",
        "           bb5   4bb   ",
        "           bb=====bb   ",
        "   c       bbbbbbbbb   ",
        "           bb-   +bb   ",
        "   p      1bb2 d 3bb   ",
        "<======================>",
    ],
    [

        "5 4      3 2  ",
        "<=>   x  <=>   ",
        "      v        ",
        "               ",
        "    6 p1       ",
        "    <==>       ",
    ]



    ];

    addLevel(levels[levelIndex], {
        width: 64,
        height: 64,

        "8": () => [
            {width: 64, height: 64},
            area(),
            "block",
            ],
        "=": () => [
            sprite("tiles", {
                frame: 4,
            }),
            area(),
            solid(),
            ],

        "<": () => [
            sprite("tiles", {
                frame: 14,
            }),
            area(),
            solid(),
            ],
        "[": () => [
            sprite("tiles", {
                frame: 3,
            }),
            area(),
            solid(),
            ],

        "]": () => [
            sprite("tiles", {
                frame: 5,
            }),
            area(),
            solid(),
            ],

        ">": () => [
            sprite("tiles", {
                frame: 15,
            }),
            area(),
            solid(),
            ],
        "a": () => [
            sprite("tiles", {
                frame: 6,
            }),
            area(),
            solid(),
            ],
        "b": () => [
            sprite("tiles", {
                frame: 2,
            }),
            area(),
            solid(),
            ],
        "-": () => [
            sprite("tiles", {
                frame: 2,
            }),
            layer("backtiles"),
            origin("center"),
            rotate(45),
            scale(0.75),

            ],
        "+": () => [
            sprite("tiles", {
                frame: 2,
            }),
            layer("backtiles"),
            rotate(315),
            scale(0.75),
            pos(32,0),
            ],

        "t": () => [
                text("Welcome to:\n CS50 Finale Project"),
                origin("center"),
            ],
        "g": () => [
                text("By: Boshhy", {size: 30}),
                origin("center"),
                pos(0,32)
            ],
        "i": () => [
                text("\nLeft arrow: move left\n\nRight arrow: move right", { size: 32}),

            ],

        "q": () => [
                text("Press up to enter\ndoors", {size: 30}),
                origin("center"),
                pos(32,30)
            ],
        "w": () => [
                text("Collect keys\nto open doors", {size: 30}),
                origin("center"),
                pos(0,30)
            ],
        "e": () => [
                text("Jump with\nspacebar", {size: 30}),
                origin("center"),
                pos(0,30)
            ],
        "r": () => [
                text("Double Jump by pressing\nspacebar\ntwice", {size: 30}),
                origin("center"),
                pos(0,30)
            ],
        "y": () => [
                text("Double\nJump", {size: 30}),
                origin("center"),
                pos(32,30)
            ],
        "u": () => [
                text("Attack with the\nX key", {size: 30}),
                origin("center"),
                pos(0,30)
            ],
        "o": () => [
                text("Green snakes will\ndrop keys", {size: 30}),
                origin("center"),
                pos(32,0)
            ],
        "j": () => [
                text("Dash attack with\n C key", {size: 30}),
                origin("center"),
                pos(32,0)
            ],
        "l": () => [
                text("Hearts will heal\nyou to full health", {size: 30}),
                origin("center"),
                pos(32,0)
            ],
        "c": () => [
                text("Hit portals with your\nsword to teleport", {size: 30}),
                origin("center"),
                pos(32,0)
            ],
        "x": () => [
                text("Tutorial over.\nLevels coming soon!\nSpecial thanks to:\n\nLaJBel\nIsological", {size: 30}),
                origin("center"),
            ],
        "v": () => [
                text("I appreciate your\nguidance, help, and time", {size: 20}),
                origin("center"),
                pos(0,64)
            ],










        "1": () => [
            sprite("beam", { anim: "idle" },
            ),
            origin("center"),
            area({scale: 0.2}),
            scale(3),
            "red1",
            layer("back"),
            pos(32,32),
            color(255,0,0),
            ],

        "2": () => [
            sprite("beam", { anim: "idle" },
            ),
            origin("center"),
            area({scale: 0.3}),
            scale(3),
            "red2",
            layer("back"),
            pos(32,32),
            color(225,0,0),
            ],

        "3": () => [
            sprite("beam", { anim: "idle" },
            ),
            origin("center"),
            area({scale: 0.2}),
            scale(3),
            "blue1",
            layer("back"),
            pos(32,32),
            color(0,0,255),
            ],

        "4": () => [
            sprite("beam", { anim: "idle" },
            ),
            origin("center"),
            area({scale: 0.3}),
            scale(3),
            "blue2",
            layer("back"),
            pos(32,32),
            color(0,0,255),
            ],
        "5": () => [
            sprite("beam", { anim: "idle" },
            ),
            origin("center"),
            area({scale: 0.2}),
            scale(3),
            "green1",
            layer("back"),
            pos(32,32),
            color(0,255,0),
            ],

        "6": () => [
            sprite("beam", { anim: "idle" },
            ),
            origin("center"),
            area({scale: 0.3}),
            scale(3),
            "green2",
            layer("back"),
            pos(32,32),
            color(0,255,0),
            ],


        "h": () => [
            sprite("heart", { anim: "idle" },
            ),
            origin("center"),
            area({scale: 0.3}),
            scale(3),
            "heart",
            layer("back"),
            pos(32,32)
            ],


        "d": () => [
            sprite("door", { frame: 0 }),
            scale(2),
            area({width: 1,}),
            origin("center"),
            pos(32,32),
            "door",
            layer("back"),
            ],
        "k": () => [
            {width: 64, height: 64},
            sprite("key", { anim: "idle" }),
            area({ width: 1,}),
            origin("center"),
            scale(3),
            pos(32, 32),
            "key",
            ],









        "p": () => [
            sprite("blue", {
                animSpeed: 1,
                frame: 0,
            }),
            origin("center"),
            area({ scale: 0.25 }),
            body(),
            scale(2.5),
            health(12),
            color(),
            "player",
            layer("front"),
            ],

        "s": () => [
            sprite("snake", { anim: "walk", flipX: true },
            {
                animSpeed: 1,
                frame: 0,
            },
            ),
            origin("center"),
            area({scale: 0.41}),
            body(),
            solid(),
            scale(3),
            patrol(100, -1),
            "enemy_snake",
            health(3),
            layer("front"),
            ],
        "z": () => [
            sprite("snake_drop", { anim: "walk", flipX: true },
            {
                animSpeed: 1,
                frame: 0,
            },
            ),
            origin("center"),
            area({scale: 0.4, offset: vec2(0, 4)},),
            body(),
            solid(),
            pos(),
            scale(3),
            patrol(100, -1),
            "enemy_snake_drop",
            health(3),
            layer("front"),
            ],


    });











    const box = get("player")[0];
    let hasKey = false;
    const healthText = add([
        text("HEALTH", {size: 32 }),
        layer("healtText"),
        pos(65, 32),
        origin("center"),
        fixed(),
        ]);
    const healthbar = add([
		rect(width(), 64),
		outline(4),
		pos(0, 0),
		color(0, 255, 0 ),
		fixed(),
		layer("front"),
		{
			max: 12,
			set(hp) {
			    if (hp <= 2){
			        this.color.r = 255;
			        this.color.g = 0;
			        this.color.b = 0;
			    }
			    else if (hp <= 4 ) {
			        this.color.r = 233;
			        this.color.g = 116;
			        this.color.b = 81;
			    }
			    else if (hp <= 8) {
			        this.color.r = 255;
			        this.color.g = 255;
			        this.color.b = 0;
			    }
			    else {
			        this.color.r = 0;
			        this.color.g = 255;
			        this.color.b = 0;
			    }

				this.width = width() * hp / this.max;
			},
		},
	]);

    facing = 1;

    layers([
            "backtiles",
		    "back",
		    "front",
		    "healtText",
	]);

    if(levelIndex == 0) {
        const door = get("door");
        door[0].play("open");
        hasKey = true;
    }

;

    box.collides("door", (d) => {
        if(hasKey){
            d.play("open");
            hasKey = false;
            keyPress("up", () => {
                go("start", levelIndex + 1)
            })
        }
    }),

    collides("enemy_snake", "sword", (s) => {
        shake();
        s.play("hurt");
        s.hurt(1);
        wait(0.5, () => {
            s.play("walk");
        });
    });

    collides("enemy_snake_drop", "sword", (s) => {
        shake();
        s.play("hurt");
        s.hurt(1);
        wait(0.5, () => {
            s.play("walk");
        });
    });

    box.on("death", () => {
            destroy(box);
            deathLocation(box);
            wait(2.5, () => {
                go("start", levelIndex);
        });
    })

    on("death", "enemy_snake", (s) => {
        destroy(s);
    })

    on("death", "enemy_snake_drop", (s) => {
        destroy(s);
        dropKey(s);
    });

    box.on("hurt", () => {
        healthbar.set(box.hp())
    })

    box.collides("heart", (h) => {
        destroy(h);
        healthbar.set(12);
        box.heal(12 - box.hp())

    })

    box.collides("enemy_snake", () => {
        shake();
        box.hurt(1);
        box.color.r = 255;
        box.color.g = 0;
        box.color.b = 80;
        wait(0.2, () => {
            box.color.r = 255;
            box.color.g = 255;
            box.color.b = 255;
        })
    });

    box.collides("enemy_snake_drop", () => {
        shake();
        box.hurt(1);
        box.color.r = 255;
        box.color.g = 0;
        box.color.b = 80;
        wait(0.2, () => {
            box.color.r = 255;
            box.color.g = 255;
            box.color.b = 255;
        })
    });


    box.collides("key", (key) => {
        destroy(key);
        hasKey = true;
    })

    collides("red1", "sword", () => {
        destination = get("red2")[0];
        box.pos.x = destination.pos.x;
        box.pos.y = destination.pos.y;
    });

    collides("red2", "sword", () => {
        destination = get("red1")[0];
        box.pos.x = destination.pos.x;
        box.pos.y = destination.pos.y;
    })

    collides("blue1", "sword", () => {
        destination = get("blue2")[0];
        box.pos.x = destination.pos.x;
        box.pos.y = destination.pos.y;
    })

    collides("blue2", "sword", () => {
        destination = get("blue1")[0];
        box.pos.x = destination.pos.x;
        box.pos.y = destination.pos.y;
    })

    collides("green1", "sword", () => {
        destination = get("green2")[0];
        box.pos.x = destination.pos.x;
        box.pos.y = destination.pos.y;
    })

    collides("green2", "sword", () => {
        destination = get("green1")[0];
        box.pos.x = destination.pos.x;
        box.pos.y = destination.pos.y;
    })















    box.play("idle");

    keyDown("left", () => {
        box.move(-250,0);
    })

    keyDown("right", () => {
        box.move(250,0);
    })

    keyPress("left", () => {
        facing = -1;
        box.flipX(true),
        box.play("run");
    });


    keyPress('right', () => {
        facing = 1;
        box.flipX(false);
        box.play("run");
    });

    keyPress("x", () => {
        box.play("attack");
        if (box.hp() > 0) {
            sword(box.pos.x, box.pos.y, facing);
        }
    });

    keyPress("c", () => {
        box.move(facing * 900, 0)
        box.play("forward");
        if (box.hp() > 0) {
            sword(box.pos.x, box.pos.y, facing, 80);
        }
    })

    keyRelease("c", () => {
        box.play("idle");
    })

    keyPress("space", () => {
        box.djump();
        box.play("jump");
    });

    keyRelease("space", () => {
        box.play("idle");
    })

    keyRelease("left", () => {
        box.play("idle");
    })

    keyRelease("right", () => {
        box.play("idle");
    })

    keyRelease("x", () => {
        box.play("idle");
    })

    box.action( () => {
        camPos(box.pos);
        if(box.pos.y > 1000){
            healthbar.set(1);
            destroy(box);
            deathLocation(box);
            wait(0.5, () => {
                healthbar.set(0);
            })
            wait(1.4, () => {
                go("start", levelIndex)
            })
        }
    })

    keyPress("f", (c) => {
        fullscreen(!fullscreen());
    })
});

go("start", 7)
