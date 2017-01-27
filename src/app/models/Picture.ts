import { filmyBucket } from "./qiniu-bucket";
import { Injectable } from "@angular/core";
import { CategoryModel } from "./Category";

import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/fromPromise";
import "rxjs/add/observable/from";

@Injectable()
export class PictureModel {
    datas: Picture[] = [];

    constructor(private category: CategoryModel) {}

    async getCategory(item: Picture | Picture[]) {
        let datas = JSON.parse(JSON.stringify(item));
        let categories = await this.category.load();

        if (datas instanceof Array) {
            datas.forEach(p => {
                let theCategory = categories.find(e => e.id === +p.category);

                if (theCategory) {
                    p.category = theCategory;
                }
            })
        } else {
            let theCategory = categories.find(e => e.id === +datas.category);
            if (theCategory) {
                datas.category = theCategory;
            }
        }

        return datas;
    }

    async load() {
        if (!this.datas.length) {
            return await filmyBucket.getFile(`pictures.json?v=${Date.now()}`)
                            .then(body => JSON.parse(body))
                            .then(pictures => {
                                this.datas = pictures;
                                return this.getCategory(this.datas);;
                            }).catch(() => {
                                this.saveToCloude("test2");
                            });
        } else {
            return await Promise.resolve(this.getCategory(this.datas));
        };
    }

    /**
     * 添加图片
     */
    async putImageToServer(file: File) {
        let putToken = await filmyBucket.fetchPutToken("test2",null);

        let type = file.name.split(".");
        return filmyBucket.putFile(`assets/pictures-${Date.now()}.${type[type.length - 1]}`,file, {putToken});
    }

    /**
     * 添加图片信息
     * */
    addPicture(data: Picture) {
        let hasItem = this.datas.find(e => e.title === data.title);

        if (!hasItem) {
            data.id = Date.now();
            this.datas.push(JSON.parse(JSON.stringify(data)));
            return this.saveToCloude("test2").then(() => this.load());
        } else {
            return Promise.reject("图片已经存在")
        }
    }

    /**
     * 删除图片信息
     *
     * */
    deletePicture(data: Picture) {
        let index= this.datas.findIndex(e => e.id === data.id);
        if (index >= 0) {
            this.datas.splice(index,1);
            return this.saveToCloude("test2").then(() => this.datas);
        } else {
            return Promise.reject("没有这个图片");
        }
    }

    /**
     * 保存到云端
     * */
    async saveToCloude(password: string) {
        if (typeof password !== "string") {
            throw new TypeError("密码类型错误")
        }

        let putToken = await filmyBucket.fetchPutToken(password, "pictures.json");

        console.log(this.datas)
        const pictureData = new Blob([JSON.stringify(this.datas)], {type: "application/json"});
        pictureData["name"] = "pictures.json";

        return filmyBucket.putFile(
            pictureData["name"],
            pictureData,
            {putToken}
        )
    }

    /**
     * 获取图片详情
     */
    getPicture(id: number) {
        if (this.datas.length) {
            return Observable.from(this.datas).filter(e => {
                console.log(e);
                return e.id === id;
            });
        } else {
            return Observable.fromPromise(this.load().then(data => data.find(e => e.id === id)))
        }

    }
}

export interface Picture {
    title?: string;
    content?: string;
    category?: string;
    created_at?: number;
    photos?: string[];
    id?: number;
}
