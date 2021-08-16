import { NgModule } from "@angular/core";
import { Routes, RouterModule, PreloadAllModules } from "@angular/router";

const appRoutes: Routes = [
  { path: "", redirectTo: "/recipes", pathMatch: "full" },
  {
    //lazy loading modules
    path: "recipes",
    loadChildren: () => {
      return import("./recipes/recipes.module")
        .then((m) => {
          return m.RecipesModule;
        })
        .catch((err) => console.log("Error in import"));
    },
  },
  {
    path: "shopping-list",
    loadChildren: () => {
      return import("./shopping-list/shopping-list.module").then(
        (m) => m.ShoppingListModule
      );
    },
  },
  {
    path: "auth",
    loadChildren: () => import("./auth/auth.module").then((m) => m.AuthModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
