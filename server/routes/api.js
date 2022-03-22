const express = require("express");
const router = express.Router();
const axios = require("axios");
const { tbUser } = require("../models");
const joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Config Defaults Axios dengan Detail Akun Rajaongkir
axios.defaults.baseURL = "https://api.rajaongkir.com/starter";
axios.defaults.headers.common["key"] = "c32a8917c562ad64f747e24b0cc0a289";
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

// Router GET province
router.get("/provinsi", (req, res) => {
  axios
    .get("/province")
    .then((response) => res.json(response.data))
    .catch((err) => res.send(err));
});

// Router GET city by province_id
router.get("/kota/:provId", (req, res) => {
  const id = req.params.provId;
  axios
    .get(`/city?province=${id}`)
    .then((response) => res.json(response.data))
    .catch((err) => res.send(err));
});

// Router GET costs
router.get("/ongkos/:asal/:tujuan/:berat/:kurir", (req, res) => {
  const param = req.params;
  axios
    .post("/cost", {
      origin: param.asal,
      destination: param.tujuan,
      weight: param.berat,
      courier: param.kurir,
    })
    .then((response) => res.json(response.data))
    .catch((err) => res.send(err));
});

// Route User
// Auth
router.post("/register", async (req, res) => {
  try {
    const data = req.body;

    const schema = joi.object({
      name: joi.string().min(4).required(),
      email: joi.string().email().required(),
      password: joi.string().min(6).required(),
    });

    const { error } = schema.validate(data);

    if (error) {
      return res.status(401).send({
        status: "Validation Failed",
        message: error.details[0].message,
      });
    }

    const checkEmail = await tbUser.findOne({
      where: {
        email: data.email,
      },
    });

    if (checkEmail) {
      return res.status(400).send({
        status: "Failed",
        message: "Email already registered",
      });
    }

    const hashStrenght = 10;
    const hashhedPassword = await bcrypt.hash(data.password, hashStrenght);

    const dataUser = await tbUser.create({
      ...data,
      password: hashhedPassword,
    });

    const tokenData = {
      id: dataUser.id,
      name: dataUser.name,
      email: dataUser.email,
    };

    const secretKey = process.env.SECRET_KEY;

    const token = jwt.sign(tokenData, secretKey);

    res.status(200).send({
      status: "success",
      data: {
        user: {
          id: dataUser.id,
          name: dataUser.name,
          email: dataUser.email,
          token,
        },
      },
    });
  } catch (err) {
    //  Jika error
    console.log(err);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const data = req.body;

    // Validasi input
    const schema = joi.object({
      email: joi.string().email().required(),
      password: joi.string().min(6).required(),
    });

    // Deklarasi validasi
    const { error } = schema.validate(data);

    // Jika data tidak valid
    if (error) {
      return res.status(400).send({
        status: "validation failed",
        message: error.details[0].message,
      });
    }

    // Cek Email
    const dataOnTable = await tbUser.findOne({
      where: {
        email: data.email,
      },
    });

    // Jika belum didaftarkan
    if (!dataOnTable) {
      return res.status(400).send({
        status: "failed",
        message: "email and password don't match",
      });
    }

    // Cek Password
    const validatePassword = await bcrypt.compare(
      data.password,
      dataOnTable.password
    );

    // Password Salah
    if (!validatePassword) {
      return res.status(400).send({
        status: "failed",
        message: "email and password don't match",
      });
    }

    // Generate token
    const tokenData = {
      id: dataOnTable.id,
      name: dataOnTable.name,
      email: dataOnTable.email,
      role: dataOnTable.role,
    };

    const secretKey = process.env.SECRET_KEY;

    const token = jwt.sign(tokenData, secretKey);

    // Jika semuanya berhasil
    res.status(200).send({
      status: "success",
      data: {
        user: {
          id: dataOnTable.id,
          name: dataOnTable.name,
          email: dataOnTable.email,
          token,
        },
      },
    });
  } catch (err) {
    //  Jika error
    console.log(err);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
});

module.exports = router;
