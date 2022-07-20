const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Post = require("../models/post");

exports.createPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title,
      content,
      imagePath: url + "/images/" + req.file.filename,
      creator: req.userData.userId,
    });

    await post.save();
    return res.status(201).json({
      message: "Post created successfully",
      post: post,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.getPosts = async (req, res, next) => {
  try {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;

    const totalRecords = await Post.count();
    var posts = await Post.find();
    if (pageSize && currentPage) {
      posts = await Post.find()
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }

    return res.status(201).json({
      message: "Hello",
      posts: posts,
      totalRecords: totalRecords,
    });
  } catch (error) {
    console.log(error.message);
  }
};

exports.getPostById = async (req, res, next) => {
  const post = await Post.findOne({ _id: req.params.id });
  return res.status(200).json({
    message: "Get post successfully",
    post: post,
  });
};

exports.deletePostById = async (req, res, next) => {
  const id = req.params.id;
  Post.deleteOne({ _id: id, creator: req.userData.userId }).then((data) => {
    if (data.n > 0) {
      res.status(200).json({ message: "Delete successfully!" });
    } else {
      res.status(400).json({ message: "Not authorized!" });
    }
  });
};

exports.updatePostById = async (req, res, next) => {
  try {
    const { id, title, content } = req.body;
    let imageUrl;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imageUrl = url + "/images/" + req.file.filename;
    }

    const post = new Post({
      _id: id,
      title,
      content,
      imagePath: imageUrl,
      creator: req.userData.userId,
    });

    Post.updateOne(
      { _id: req.params.id, creator: req.userData.userId },
      post
    ).then((data) => {
      if (data.nModified > 0) {
        return res.status(200).json({ message: "Update successfully!" });
      } else {
        return res.status(400).json({ message: "Not authorized!" });
      }
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
