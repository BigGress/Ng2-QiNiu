import {
    Component,
    OnInit
} from "@angular/core";
import {
    ActivatedRoute,
    Params
} from "@angular/router";

import { CategoryModel } from "../../models/Category";
import { PictureModel, Picture } from "../../models/Picture";
import { fadeInOut } from "../../animate/fadeInOut";

@Component({
    template: require("./detail.component.html"),
    styles: [require("./detail.component.scss")],
    animations: fadeInOut
})
export class DetailCategoryComponent implements OnInit {
    sourcePictures: Picture[] = [];
    sourceCategories: any[] = [];
    pictures: Picture[] = [];

    title: string = "";

    constructor(
        private picture: PictureModel,
        private category: CategoryModel,
        private route: ActivatedRoute
    ) {

    }

    async ngOnInit() {
        this.sourceCategories = await this.category.load();
        this.sourcePictures = await this.picture.load();
        console.log(this.sourceCategories,this.sourcePictures);
        this.filterPicture();

        let theCategory = this.sourceCategories.find(e => e.id === +this.route.snapshot.params["categoryId"]);
        if (theCategory) {
            this.title = theCategory.title;
        }
    }

    /**
     * 过滤图片信息
     */
    filterPicture() {

        this.pictures = this.sourcePictures.filter(e => {
            if (e.category) {
                return e.category["id"] === +this.route.snapshot.params["categoryId"]
            } else {
                return false;
            }
        });

        console.log(this.pictures);
    }
}
