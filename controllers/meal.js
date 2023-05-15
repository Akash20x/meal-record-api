require("dotenv").config();
const Meal = require("../models/Meal");
const axios = require("axios");

const axiosConfig = {
    headers: {
      "x-app-id": process.env.NUTRITIONIX_X_ID,
      "x-app-key": process.env.NUTRITIONIX_X_KEY,
      "Content-Type": "application/json",
    },
  };

  exports.createMeal = async (req, res) => {
      try {
          let { name, time, calories } = req.body;
          if (!calories) {
              try {
                  const postData = JSON.stringify({ query: name });
                  const response = await axios.post(
                      "https://trackapi.nutritionix.com/v2/natural/nutrients",
                      postData,
                      axiosConfig
                      );
            const result = response.data;
            if (result?.foods) {
              calories = result?.foods[0]?.nf_calories;
            }
          } catch (error) {
            res.status(500).json({ message: error.message });
          }
        }
    
        const meal = {
          userId: req.user.id,
          name,
          time,
          calories: calories ? calories : 250,
        };
    
        const createdMeal = await Meal.create(meal);
    
        return res.status(200).json({
          createdMeal,
        });
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
}



exports.getUserMeals = async (req, res) => {
    try {
        const { page, limit, search } = req.query;
        const pageNum = page ? parseInt(page) : 1;
        const limitNum = limit ? parseInt(limit) : 10;
        const skip = (pageNum - 1) * limitNum;
    
        //Filter
        let query = { userId: req.user.id };
        if (search) {
          query = {
            ...query,
            $or: [{ name: { $regex: new RegExp(search, "i") } }],
          };
        }
    
        const meals = await Meal.find(query)
          .sort({ updatedAt: -1 })
          .skip(skip)
          .limit(limitNum);
        const total = await Meal.countDocuments(query);
        return res.status(200).json({ meals, total });
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }   
}

exports.getMeal = async (req, res) => {
    try {
        const { id } = req.params;
        const meal = await Meal.findOne({ userId: req.user.id, _id: id });
        return res.status(200).json(meal);
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
}

exports.updateMeal = async (req, res) => {
    try {
        const mealId = req.params.id;
    
        const { name, time, calories } = req.body;
    
        const newMeal = {
          name,
          time,
          calories,
        };
    
        Meal.findOneAndUpdate( {
          _id: mealId,
          userId: req.user.id,
        },
        { $set: newMeal },
        {new: true}, (err, doc) => {

          if (err) {
            return res.status(404).json({
                  message: "Meal with user not found",
                });
        }
          return res.status(200).json({
            doc
          });
        })


      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
}

exports.deleteMeal = async (req, res) => {
    try {
        const mealId = req.params.id;
    
        const deletedMeal = await Meal.deleteOne({
          _id: mealId,
          userId: req.user.id,
        });
    
        if (deletedMeal.deletedCount) {
          return res.status(200).json({
            message: "Deleted Successfully",
          });
        } else {
          return res.status(404).json({
            error: "Meal not found",
          });
        }
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
}