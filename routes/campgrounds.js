const   express     = require("express"),
        router      = express.Router(),
        Campground  = require("../models/campground"),
        middleware  = require("../middleware")

//INDEX
router.get("/", function (req, res) {
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds})
        }
    })
})

//NEW
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new")
})

//CREATE
router.post("/", middleware.isLoggedIn, function (req, res) {
    const name = req.body.name
    const image = req.body.image
    const description = req.body.description
    const author = {id: req.user._id, username: req.user.username}
    const newCampground = { name: name, image: image, description: description, author: author}
    Campground.create(newCampground, function (err, newCampground) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds")
        }
    })
})

//SHOW
router.get("/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", { campground: foundCampground})
        }
    })
})

//EDIT
router.get("/:id/edit", middleware.checkOwnershipCampground, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if (err) {
            console.log(err)
            res.redirect("back")
        } else {
            res.render("campgrounds/edit", {campground: campground})
        }
    })
})

//UPDATE
router.put("/:id", middleware.checkOwnershipCampground, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
        if(err){
            res.redirect("/campgrounds")
        } else {
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})

//DESTROY
router.delete("/:id", middleware.checkOwnershipCampground, function(req, res){
    Campground.findByIdAndDelete(req.params.id, function(err){
        if (err) {
            console.log(err)
        } else {
            res.redirect("/campgrounds")
        }
    })
})

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect("/login")
}


module.exports = router