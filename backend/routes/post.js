const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const postController = require("../controllers/post");
const extractFile = require("../middleware/file");

router.post("", checkAuth, extractFile, postController.createPost);

router.put("/:id", checkAuth, extractFile, postController.updatePostById);

router.get("", postController.getPosts);

router.get("/:id", postController.getPostById);

router.delete("/:id", checkAuth, postController.deletePostById);

module.exports = router;
