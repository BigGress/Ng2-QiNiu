import {
    Component,
    OnInit,
} from "@angular/core";

import { fadeInOut } from "../../animate/fadeInOut";

import { CategoryModel } from "../../models/Category";

@Component({
    styles: [require("./category.component.scss")],
    template: require("./category.component.html"),
    animations: fadeInOut
})
export class CategoryComponent implements OnInit {
    categories: any[] = [];

    constructor(
        private category: CategoryModel
    ) {}

    async ngOnInit() {
        this.categories = await this.category.load();
    }
}
