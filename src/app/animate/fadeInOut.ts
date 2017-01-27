import {
    Component,
    trigger, state, style, animate, transition,
} from "@angular/core";

export let fadeInOut = [
        trigger("fadeInOut", [
            state("in", style({
                opacity: 1,
                transform: "translateY(0px)",
            })),
            transition("void => *", [
                style({
                    opacity: 0,
                    transform: "translateY(-20px)",
                }),
                animate(200),
            ]),
            transition("* => void", [
                style({
                    opacity: 0,
                    transform: "translateY(-20px)",
                }),
                animate(200),
            ]),
        ])
    ]
