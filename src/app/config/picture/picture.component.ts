import {
    Component,
    OnInit,
} from "@angular/core";
import { Location } from "@angular/common";

import { fadeInOut } from "../../animate/fadeInOut";

import { toastr } from "../../service/toastr.service";
import { PictureModel, Picture } from "../../models/Picture";
import { CategoryModel } from "../../models/Category";

@Component({
    styles: [require("./picture.component.scss")],
    template: require("./pricture.component.html"),
    animations: fadeInOut
})
export class PictureComponent implements OnInit {
    pictures: Picture[] = [];
    categories: any[] = [];

    images: any[] = [];

    data: Picture = {};

    constructor(
        private model: PictureModel,
        private category: CategoryModel,
        private toastr: toastr,
        private _location: Location
    ) {

    }

    async ngOnInit() {
        this.pictures = await this.model.load();
        this.categories = await this.category.load();

        this.filterCategory();

        console.log(this.pictures );
    }

    /**
     * 过滤分类
     */
    filterCategory() {
        if (this.pictures) {
            this.pictures.forEach(e => {
                let theCategory = this.categories.find(a => a.id == e.category);

                if (theCategory) {
                    e.category = theCategory.title;
                }
            });
        }
    }

    /**
     * 上传图片
     */
    updateImage(files: any[]) {
        this.images = files;
        this.images.forEach((e) => {
            let fr = new FileReader();
            fr.onload = (event) => {
                e.preview = event.target["result"];
            }
            fr.readAsDataURL(e);
        });
    }

    /**
     * 设置图片
     */
    selectImage($event: MouseEvent) {
        $event.stopPropagation();
        $event.preventDefault();

        let file = document.createElement("input");
        file.type = "file";
        file.multiple = true;
        file.addEventListener("change",(event) => {
            this.updateImage(Array.from(file.files));
        });
        file.click();
    }

    /**
     * 保存数据
     */
    async OnSubmit() {
        let image = this.images.map(e => {
            return this.model.putImageToServer(e);
        })
        let imageUrl = await Promise.all(image);

        let data:Picture = JSON.parse(JSON.stringify(this.data));
        data.photos = imageUrl.map(e => `http://oidrbj0yz.bkt.clouddn.com/${e.key}`)

        this.pictures = await this.model.addPicture(data);
        this.data = {};
    }

    /**
     * 删除图片
     */
    deletePicture(item: Picture) {
        this.toastr.confirm(`确定删除${item.title}`)
            .then(() => {
                this.model.deletePicture(item);
            })
    }

    /**
     * 返回上一页
     */
    back($event: MouseEvent) {
        $event.preventDefault();
        $event.stopPropagation();
        this._location.back();
    }
}
