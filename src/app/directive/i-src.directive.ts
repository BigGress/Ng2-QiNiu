import {
    Directive,
    HostListener,
    ElementRef,
    Input,
    OnInit,
    Renderer
} from "@angular/core";

@Directive({
    selector: "[i-src]",
})
export class ISrcDirective implements OnInit {

    @Input("i-src") url: string;

    constructor(private el: ElementRef, private render: Renderer) {}

    ngOnInit() {
        this.setSrc();
    }

    @HostListener("error") onError(event) {
        this.el.nativeElement.remove();
    }

    private setSrc() {
        this.render.setElementAttribute(this.el.nativeElement,"src",this.url);
    }
}
