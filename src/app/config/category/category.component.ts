import {
    Component,
    ViewChild,
    OnInit,
} from "@angular/core";
import { Location } from "@angular/common";

import { CategoryFace as Category, CategoryModel} from "../../models/Category";
import { toastr } from "../../service/toastr.service";

import { fadeInOut } from "../../animate/fadeInOut";


@Component({
    // moduleId: module.id,
    selector: "category-view",
    template: require("./category.component.html"),
    styles: [require("./category.component.scss")],
    animations: fadeInOut
})
export class CateGoryComponent implements OnInit {
    data: Category = {
        coverObj: {}
    };

    categories: any[] = [];

    files: File[];
    showFile: string;

    imageInput: string = "url";

    @ViewChild("categoryForm") form;

    constructor(
        private model: CategoryModel,
        private toastr: toastr,
        private _location: Location
    ) {
    }

    test() {
        console.log(this.form);
    }

    ngOnInit() {
        this.getCategories()
    }

    /**
     * 获取分类信息
     */
    getCategories() {
        this.model.load()
            .then((categories) => {
                console.log(categories);

                this.categories = categories;
            })
    }

    /**
     * 删除数据分类
     */
    deleteTheCategory(data: any) {
        this.toastr.confirm(`确定删除${data.title}`)
            .then(() => {
                this.model.deleteCategory(data);
            });
    }

    /**
     * 保存数据的方法
     */
    async onSubmit(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        if (!this.data.title) {
            console.log("123")
            return false;
        }

        console.log("123")

        // 图片和url只能给一个
        if (this.imageInput === "file") {
            let filesArr = await this.model.putImageToServer("test2",this.files[0]);
            this.data.cover = `http://oidrbj0yz.bkt.clouddn.com/${filesArr.key}`;
        } else {
            this.data.cover = this.data.coverObj.url;
        }

        return this.model.addCategory(this.data)
                    .then(() => {
                        this.toastr.alert("添加成功");
                    })
                    .catch(error => {
                        console.error(error);
                    });
    }

    /**
     * 上传图片
     */
    updateImage(files) {
        this.files = files;

        // preview image
        let fr = new FileReader();
        fr.onload = (e) => {
            console.log(e);
            this.showFile =  e.target["result"];
        }

        fr.readAsDataURL(files[0]);
    }

    /**
     * 选择图片
     */
    openFileSelect($event: MouseEvent) {
        $event.stopPropagation();
        $event.preventDefault();

        let fileSelect = document.createElement("input");
        fileSelect.type = "file";
        fileSelect.addEventListener("change",() => {
            this.updateImage(fileSelect.files);
        })

        fileSelect.click();


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

