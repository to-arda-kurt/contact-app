const express = require('express');
const router = express.Router();

// @route       GET    api/contacts
// @desc        Get all users contacts
// @access      Private
router.get('/', (req,res) => {
    res.send('Get all contacts')
});

// @route       POST    api/contacts
// @desc        Add New Contact
// @access      Private
router.post('/', (req,res) => {
    res.send('Add New Contact')
});

// @route       PUT    api/contacts
// @desc        Update Contact
// @access      Private
router.put('/:id', (req,res) => {
    res.send('Update Contact')
});

// @route       DELETE    api/contacts
// @desc        Delete Contact
// @access      Private
router.delete('/:id', (req,res) => {
    res.send('Delete Contact')
});

module.exports = router;
