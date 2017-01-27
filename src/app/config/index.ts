import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "@angular/material";

// 设置主页
import { SettingViewComponent } from "./setting/setting.component";

// 目录
import { CateGoryComponent } from "./category/category.component";

// 产品
import { PictureComponent } from "./picture/picture.component";

// 服务
import { toastr } from "../service/toastr.service";

// 管道
import { ISrcDirective } from "../directive/i-src.directive";

import { PublicDirectiveModule } from "../directive/driective.module";

export const routes = [
    {
        path: "",
        component: SettingViewComponent,
        children: [
            {
                path: "category", component: CateGoryComponent
            },
            {
                path: "product", component: PictureComponent
            }
        ]
    },
]

@NgModule({
    declarations: [
        SettingViewComponent,
        CateGoryComponent,
        PictureComponent,
        ISrcDirective,
    ],
    imports: [
        FormsModule,
        CommonModule,
        MaterialModule.forRoot(),
        RouterModule.forChild(routes),
        PublicDirectiveModule,
    ],
    providers: [
        toastr,
    ],
})
export default class SettingModule {
    static routes = routes;
}
