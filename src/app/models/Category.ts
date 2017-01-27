import min from "min";
import Model from "min-model";
import { filmyBucket } from "./qiniu-bucket";
import { isString } from "lodash";

import { Injectable } from "@angular/core";

@Injectable()
export class CategoryModel {
    datas: CategoryFace[] = [];

    constructor() {
        this.load();
    }

    /**
     * 删除服务器图片
     */
    // async deleteImage(password: string, url: string) {
    //     let putToken = await filmyBucket.fetchPutToken(password,null);

    //     return filmyBucket.delete(url)
    // }

    /**
     * 往服务器添加图片
     */
    async putImageToServer(password: string, file: File) {
        let putToken = await filmyBucket.fetchPutToken(password,null)

        console.log(putToken)
        let type = file.name.split(".");
        let upFile = filmyBucket.putFile(`assets/category-${Date.now()}.${type[type.length - 1]}`,file, {putToken});
        return upFile;
    }

    /**
     * 添加分类
     */
    addCategory(data: any) {
        let hasItem = this.datas.find(e => e.title === data.title);
        if (!hasItem) {
            data.id = Date.now();
            this.datas.push(JSON.parse(JSON.stringify(data)));
            return this.saveToCloud("test2").then(() => this.datas);
        } else {
            return Promise.reject("分类已经存在");
        }
    }

    /**
     * 删除目录的方法
     */
    deleteCategory(data: any) {
        let index = this.datas.findIndex(e => e.title === data.title);
        if (index >= 0) {
            this.datas.splice(index,1);
            return this.saveToCloud("test2").then(() => this.datas);
        } else {
            return Promise.reject("没有这个分类");
        }
    }

    /**
     * 加载数据
     */
    load() {
        if (!this.datas.length) {
            return filmyBucket.getFile("categories.json?v=" + Date.now())
                        .then(body => JSON.parse(body))
                        .then(categories => {
                            this.datas = categories;
                            return this.datas;
                        })
        } else {
            return Promise.resolve(this.datas)
        }
    }

    /**
     * 保存到云端
     */
     async saveToCloud(password: string) {
        if (!isString(password)) {
            throw new TypeError("密码类型错误")
        }

        let putToken = await filmyBucket.fetchPutToken(password,"categories.json");

        const fileData = new Blob([JSON.stringify(this.datas)], {type: "application/json"});
        fileData["name"] = "categories.json";
        return filmyBucket.putFile(
            fileData["name"],
            fileData,
            {putToken}
        )

        // return filmyBucket.fetchPutToken(password,"categories.json")
        //     .then(putToken => {
        //         return Promise.resolve([this.datas,putToken]);
        //     })
        //     .then(([data, putToken]) => {
        //         console.log(data)
        //         const fileData = new Blob([JSON.stringify(data)], {type: "application/json"});
        //         fileData["name"] = "categories.json";
        //         return filmyBucket.putFile(
        //             fileData["name"],
        //             fileData,
        //             {putToken}
        //         )
        //     })
    }
}

export interface CategoryFace {
    title?: string,
    name?: string,
    subtitle?: string,
    cover?: string,
    coverObj?: any,
}
