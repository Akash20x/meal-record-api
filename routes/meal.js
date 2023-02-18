const express = require("express");
const router = express.Router();
const mealController = require("../controllers/meal");

router.post("/", mealController.createMeal);
router.get("/", mealController.getUserMeals);
router.get("/:id", mealController.getMeal);
router.put("/:id", mealController.updateMeal);
router.delete("/:id", mealController.deleteMeal);


module.exports = router;
 