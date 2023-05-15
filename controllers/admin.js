require("dotenv").config({ path: "./config/.env" });
const Meal = require("../models/Meal");
const User = require("../models/User");

exports.getAllMeals = async (req, res) => {
  
    try {
        const { page, limit, search } = req.query;
        const pageNum = page ? parseInt(page) : 1;
        const limitNum = limit ? parseInt(limit) : 6;
        const skip = (pageNum - 1) * limitNum;
    
        //Filter
        let query = {};
        if (search) {
          query = {
            ...query,
            $or: [{ name: { $regex: new RegExp(search, "i") } }],
          };
        }
    
        const meals = await Meal.find(query)
          .skip(skip)
          .limit(limitNum);
        const total = await Meal.countDocuments(query);
        return res.status(200).json({ meals, total });
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }   
      
  };



  exports.getUsers = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const pageNum = page ? parseInt(page) : 1;
        const limitNum = limit ? parseInt(limit) : 6;
        const skip = (pageNum - 1) * limitNum;

        const users = await User.find({})
        .skip(skip)
        .limit(limitNum);
      const total = await User.countDocuments({});
      return res.status(200).json({ users, total });

    }
    catch (error){
        return res.status(500).json({ message: error.message });
    }
  }

  
  exports.makeAdmin = async (req, res) => {
    try{

        const userId = req.params.id;
        const { isAdmin } = req.body;

        if (!userId) {
      return res.status(400).json({ message: "User ID required" });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        message: "User Does't exist with specified id"
      });
    }
    
    const updatedUser = await User.findByIdAndUpdate(user.id, {
        role: isAdmin ? "admin" : "user",
    });

    return res.status(200).json({
        message: "User role updated successfully",updatedUser});
    }
    catch(error){
        return res.status(500).json({ message: error.message })
    }
 
  }

  exports.getMeal = async (req, res) => {
    try {
        const { id } = req.params;
        const meal = await Meal.findOne({ _id: id });
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
        },
        { $set: newMeal },
        {new: true}, (err, doc) => {

          if (err) {
            return res.status(404).json({
                  message: "Meal not found",
                });
        }
          return res.status(200).json({
            message: "Meal updated Successfully",
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
        });
    
        if (deletedMeal.deletedCount) {
          return res.status(200).json({
            message: "Deleted Successfully"
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


  exports.getStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const mealCount = await Meal.countDocuments();
        const adminCount = await User.find({ role: "admin" }).countDocuments();
    
        return res.status(200).json({ userCount, mealCount, adminCount });
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }  
}