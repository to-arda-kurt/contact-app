const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

const User = require("../models/user");
const Contact = require("../models/Contact");

// @route       GET    api/contacts
// @desc        Get all users contacts
// @access      Private / Protected / Second Parameter Auth from Middleware
router.get("/", auth, async (req, res) => {
  // Need to Pull Data from Database
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route       POST    api/contacts
// @desc        Add New Contact
// @access      Private / multi middleware with check
router.post(
  "/",
  [auth, [check("name", "Name is required").not().isEmpty()]],
  async (req, res) => {
    //Oncelikle error/hata kontrolu yaparak eger validationda bir hata varsa o hatayi donelim
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //Eger bir hata donmezse body den verileri cekelim post verileri body ile cekiyoruz
    const { name, email, phone, type } = req.body;
    //TRYCATCH blogu kuruyoruz az once body araciligi ile aldigimiz verilerle yeni bur contact yaratacagiz.
    //user: req.user.id olan ver auth middlewareden gelen veri
    try {
      const newContact = new Contact({
        name,
        email,
        phone,
        type,
        user: req.user.id,
      });
      // Yarattigimiz contact verisini veritabanina yazalim
      const contact = await newContact.save();
      // yaratilan bu veriyi json objesi olarak res donelim
      res.json(contact);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route       PUT    api/contacts
// @desc        Update Contact
// @access      Private
router.put("/:id", auth, async (req, res) => {
  const { name, email, phone, type } = req.body;

  //SUBMIT ETMEDEN HEMEN ONCE CONTACT OBJESINI YARATALIM CONTACT FIELDS ILE YARATTIGIMIZ OBJE GUNCELLENECEK OBJEYI BELIRLIYOR
  const contactFields = {};
  if (name) contactFields.name = name;
  if (email) contactFields.email = email;
  if (phone) contactFields.phone = phone;
  if (type) contactFields.type = type;

  //TRYCATCH Blogu Yaratiyoruz ve GUNCELLENECEK CONTACTI BULUYORUZ
  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) {
      res.status(404).json({ msg: "Contact not found" });
    }

    // EMIN OLMAMIZ GEREKEN HER USERIN KENDI CONTACTINA ULASMASI
    // CONTACT USER = DEGISTIRMEYE CALISTIGIMIZ CONTACT REFERANSI HANGI KULLANICIYA AIT OLDUGU
    // REQ.USER.ID = TALEBI YAPAN USER
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authorised" });
    }

    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        $set: contactFields,
      },
      { new: true }
    );

    res.json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route       DELETE    api/contacts
// @desc        Delete Contact
// @access      Private
router.delete("/:id", auth, async (req, res) => {
  //TRYCATCH Blogu Yaratiyoruz ve GUNCELLENECEK CONTACTI BULUYORUZ
  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) {
      res.status(404).json({ msg: "Contact not found" });
    }

    // EMIN OLMAMIZ GEREKEN HER USERIN KENDI CONTACTINA ULASMASI
    // CONTACT USER = DEGISTIRMEYE CALISTIGIMIZ CONTACT REFERANSI HANGI KULLANICIYA AIT OLDUGU
    // REQ.USER.ID = TALEBI YAPAN USER

    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authorised" });
    }

    await Contact.findByIdAndRemove(req.params.id);

    res.json({ msg: "contact removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
