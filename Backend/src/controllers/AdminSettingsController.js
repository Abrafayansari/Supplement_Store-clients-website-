import { prisma } from "../config/db.js";

class AdminSettingsController {
  // Get admin settings
  async getSettings(req, res) {
    try {
      let settings = await prisma.adminSettings.findFirst();

      // If no settings exist, create default ones
      if (!settings) {
        settings = await prisma.adminSettings.create({
          data: {
            headline: "Welcome to NEXUS",
            deliveryCharges: JSON.stringify([]),
          },
        });
      }

      res.status(200).json({
        success: true,
        data: {
          ...settings,
          deliveryCharges: JSON.parse(settings.deliveryCharges || "[]"),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching settings",
        error: error.message,
      });
    }
  }

  // Update admin settings
  async updateSettings(req, res) {
    try {
      const {
        city,
        province,
        country,
        address,
        email,
        phone,
        whatsapp,
        headline,
        youtubeUrl,
        facebookUrl,
        instagramUrl,
        linkedinUrl,
        deliveryCharges,
        accountTitle,
        bankAccountHolder,
        iban,
        bankName,
      } = req.body;

      // Get existing settings or create new ones
      let settings = await prisma.adminSettings.findFirst();

      if (!settings) {
        settings = await prisma.adminSettings.create({
          data: {
            city,
            province,
            country,
            address,
            email,
            phone,
            whatsapp,
            headline,
            youtubeUrl,
            facebookUrl,
            instagramUrl,
            linkedinUrl,
            deliveryCharges: JSON.stringify(deliveryCharges || []),
            accountTitle,
            bankAccountHolder,
            iban,
            bankName,
          },
        });
      } else {
        settings = await prisma.adminSettings.update({
          where: { id: settings.id },
          data: {
            city,
            province,
            country,
            address,
            email,
            phone,
            whatsapp,
            headline,
            youtubeUrl,
            facebookUrl,
            instagramUrl,
            linkedinUrl,
            deliveryCharges: JSON.stringify(deliveryCharges || []),
            accountTitle,
            bankAccountHolder,
            iban,
            bankName,
          },
        });
      }

      res.status(200).json({
        success: true,
        message: "Settings updated successfully",
        data: {
          ...settings,
          deliveryCharges: JSON.parse(settings.deliveryCharges || "[]"),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating settings",
        error: error.message,
      });
    }
  }

  // Get delivery charges for a specific province
  async getDeliveryCharge(req, res) {
    try {
      const { province } = req.params;

      const settings = await prisma.adminSettings.findFirst();
      if (!settings) {
        return res.status(404).json({
          success: false,
          message: "Settings not found",
          charge: 0,
        });
      }

      const deliveryCharges = JSON.parse(settings.deliveryCharges || "[]");
      const provinceCharge = deliveryCharges.find(
        (dc) => dc.province.toLowerCase() === province.toLowerCase()
      );

      res.status(200).json({
        success: true,
        charge: provinceCharge?.charge || 0,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching delivery charge",
        error: error.message,
        charge: 0,
      });
    }
  }
}

export default new AdminSettingsController();
