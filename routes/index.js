import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send({ response: "I am alive" });
});

export default router;
