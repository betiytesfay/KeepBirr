import {
  getAllContacts,
  createContact,
  deleteContact,
} from '../services/contactService.js';

export const getContactsHandler = async (req, res) => {
  try {
    const ownerId = req.user.userId;
    const data = await getAllContacts(ownerId);
    res.json({ success: true, data });
  } catch (error) {
    console.error("getContactsHandler error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to fetch contacts" });
  }
};

export const createContactHandler = async (req, res) => {
  try {
    const ownerId = req.user.userId;
    const { name, phone, accountNumber } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: "Name is required" });
    }

    const contact = await createContact(ownerId, { name, phone, accountNumber });
    res.status(201).json({ success: true, data: contact });
  } catch (error) {
    console.error("createContactHandler error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to create contact" });
  }
};

export const deleteContactHandler = async (req, res) => {
  try {
    const ownerId = req.user.userId;
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: "Invalid contact ID" });
    }

    const deleted = await deleteContact(ownerId, id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: "Contact not found" });
    }

    res.json({ success: true, message: "Contact deleted", data: deleted });
  } catch (error) {
    console.error("deleteContactHandler error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to delete contact" });
  }
};
