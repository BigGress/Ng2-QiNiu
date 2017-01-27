import {
    Component,
    OnInit,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { PictureModel, Picture } from "../models/Picture";
import { fadeInOut } from "../animate/fadeInOut";

@Component({
    styles:[require("./picture.component.scss")],
    template: require("./picture.component.html"),
    animations: fadeInOut
})
export class PictureComponent implements OnInit {
    detailData: Picture;

    constructor(
        private picture: PictureModel,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.picture.getPicture(+this.route.snapshot.params["pictureId"])
            .subscribe(data => {
                this.detailData = data;

                console.log(this.detailData);

            })


    }
}
