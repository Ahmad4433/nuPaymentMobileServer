// models
const { Contact } = require("../../models/cms/Contact");

// To create a contact
const onCreateContact = async (req, res) => {
    try {

        const contact = await Contact.createContact({ contactParams: req.body });
        return res.status(200).json({ success: true, contact });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, error: error });
    }
}

// To update a contact
const onUpdateContact = async (req, res) => {
    try {
        const contact = await Contact.updateContact({ contactParams: req.body });
        return res.status(200).json({ success: true, contact });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, error: error });
    }
}

// Get contact by ID
const onGetContactById = async (req, res) => {
    try {
        const contact = await Contact.getContactById(req.params.id);
        return res.status(200).json({ success: true, contact });
    } catch (error) {
        return res.status(500).json({ success: false, error: error })
    }
}

// Get all contacts
const onGetAllContacts = async (req, res) => {
    try {

        const contacts = await Contact.getContacts();
        return res.status(200).json({ success: true, contacts });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "An error occured" });
    }
}

// To delete a contact 
const onDeleteContactById = async (req, res) => {
    try {
        const contact = await Contact.deleteContactById(req.params.id);
        return res.status(200).json({
            success: true,
            message: `Deleted a count of ${contact.deletedCount} contacts.`
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: error })
    }
}

module.exports = {
    onCreateContact,
    onUpdateContact,
    onGetContactById,
    onGetAllContacts,
    onDeleteContactById,
}