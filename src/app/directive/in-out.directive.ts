import {
    Directive
} from "@angular/core";

@Directive({
    selector: "[in-out]",
    host: {
        "[@fadeInOut]": "'in'"
    },
})
export class AnimateInOut {

}
