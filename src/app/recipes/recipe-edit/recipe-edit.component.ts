import { Component, OnInit } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Recipe } from "../recipe.model";
import { RecipeService } from "../recipe.service";

@Component({
  selector: "app-recipe-edit",
  templateUrl: "./recipe-edit.component.html",
  styleUrls: ["./recipe-edit.component.css"],
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipeForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = +params["id"];
      this.editMode = params["id"] != null;
      this.initForm();
    });
  }

  private initForm() {
    const recipe = this.editMode && this.recipeService.getRecipe(this.id);
    let recipeIngradients = new FormArray([]);

    if (recipe.ingredients) {
      for (let ingradient of recipe.ingredients) {
        recipeIngradients.push(
          new FormGroup({
            name: new FormControl(ingradient.name, Validators.required),
            amount: new FormControl(ingradient.amount, [
              Validators.required,
              Validators.pattern(/^[1-9]+[0-9]*$/),
            ]),
          })
        );
      }
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipe.name || "", Validators.required),
      imagePath: new FormControl(recipe.imagePath || "", Validators.required),
      description: new FormControl(
        recipe.description || "",
        Validators.required
      ),
      ingredients: recipeIngradients,
    });
  }

  addIngradient() {
    (<FormArray>this.recipeForm.get("ingredients")).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/),
        ]),
      })
    );
  }

  get controls() {
    //getter
    return (<FormArray>this.recipeForm.get("ingredients")).controls;
  }

  private onSubmit() {
    if (this.editMode) {
      this.recipeService.updateRecipe(this.id, this.recipeForm.value);
    } else {
      console.log(this.recipeForm.value);
      this.recipeService.addRecipe(this.recipeForm.value);
    }
    this.onCancel();
  }

  onCancel() {
    this.router.navigate(["../"], { relativeTo: this.route });
  }

  onDeleteIngradient(index: number) {
    console.log(index);
    (<FormArray>this.recipeForm.get("ingredients")).removeAt(index);
  }
}
