const mongoose = require("mongoose");
const { FAQ } = require("../../models/faq")
const { Admin } = require('../../models/Admin');
const FAQCreate_ = async (req, res) => {
    try {
        const { subject, body } = req.body
        const userId = req.user.userId
        if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ message: "invalid object Id" })
        if (!subject || !body) {
            return res.status(400).json({ message: "please write something" })
        }
        const user = await Admin.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }
        const createfaq = await FAQ.create(req.body)
        return res.status(201).json(createfaq) 
    }
    catch (err) {
        return res.status(500).json({ message: "somthing want wrong" })
    }
}

const FAQRead_ = async (req, res) => {
    try {
        const userId = req.user.userId
        if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ message: "invalid object Id" })
        const user = await Admin.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }
        const getFaq = await FAQ.find({ isActive: true })
        return res.status(200).json({ message: "get", data: getFaq })
    } catch (error) {
        return res.status(500).json({ message: "somthing want wrong" })
    }
}

const FAQUpadte_ = async (req, res) => {
    try {
        const faqId = req.params.id
        const userId = req.user.userId
        const data = req.body
        if (!data) return res.status(400).json({ message: "body can't empty" })
        if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ message: "invalid object Id" })
        if (!mongoose.Types.ObjectId.isValid(faqId)) return res.status(400).json({ message: "invalid object Id" })
        const user = await Admin.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }
        const faq = await FAQ.findById(faqId)
        if (!faq) {
            return res.status(404).json({ message: "faq not found" })
        }
        const updatedFaq = await FAQ.findByIdAndUpdate(faqId, { $set: data }, { new: true })
        return res.status(200).json({ message: "update", data: updatedFaq })
    }
    catch (err) {
        return res.status(500).json({ message: "somthing want wrong" })
    }
}

const FAQRemove_ = async (req, res) => {
    try {
        const faqId = req.params.id
        const userId = req.user.userId
        if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ message: "invalid object Id" })
        if (!mongoose.Types.ObjectId.isValid(faqId)) return res.status(400).json({ message: "invalid object Id" })
        const user = await Admin.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }
        const faq = await FAQ.findById(faqId)
        if (!faq) {
            return res.status(404).json({ message: "faq not found" })
        }
        const deletedFaq = await FAQ.findByIdAndDelete(faqId)
        return res.status(200).json({ message: "sucessfuly Deleted" })
    }
    catch (err) {
        return res.status(500).json({ message: "somthing want wrong" })
    }
}

const FAQToggleInActive = async (req, res) => {
    try {
        const faqId = req.params.id
        const userId = req.user.userId
        if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ message: "invalid object Id" })
        if (!mongoose.Types.ObjectId.isValid(faqId)) return res.status(400).json({ message: "invalid object Id" })
        const user = await Admin.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }
        const faq = await FAQ.findById(faqId)
        if (!faq) {
            return res.status(404).json({ message: "faq not found" })
        }
        const updatedFaq = await FAQ.findByIdAndUpdate(faqId, { $set: { isActive: !faq.isActive } }, { new: true })
        return res.status(200).json({ message: "This faq is inactive" })
    } catch (error) {
        return res.status(500).json({ message: "somthing want wrong" })
    }
}

module.exports = { FAQCreate_, FAQUpadte_, FAQRemove_, FAQRead_, FAQToggleInActive }