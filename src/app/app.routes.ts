import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home';
import { AboutComponent } from './about';
import { NoContentComponent } from './no-content';

import { DataResolver } from './app.resolver';

// import { SettingViewComponent } from "./config/setting/setting.component";

import { CategoryComponent } from "./category/list/category.component";
import { DetailCategoryComponent } from "./category/detail/detail.component";

import { PictureComponent } from "./picture/picture.component";

export const ROUTES: Routes = [
  { path: '',      component: HomeComponent },
  { path: 'home',  component: HomeComponent },
  {
      path: "category",
      children: [{
          path: "",
          component: CategoryComponent,
      },{
          path: ":categoryId",
          component: DetailCategoryComponent
      }]
  },
  {
      path: "picture/:pictureId",
      component: PictureComponent
  },
  {
      path: "setting", loadChildren: () => System.import("./config/index")
                        .then(comp => comp.default),
  },
  { path: '**',    component: NoContentComponent },
];
