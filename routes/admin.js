const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");

router.get("/meals", adminController.getAllMeals);
router.get("/users", adminController.getUsers);
router.put("/users/:id", adminController.makeAdmin);
router.get("/meals/:id", adminController.getMeal);
router.put("/meals/:id", adminController.updateMeal);
router.delete("/meals/:id", adminController.deleteMeal);
router.get("/stats", adminController.getStats);



module.exports = router;