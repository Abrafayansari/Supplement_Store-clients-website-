import { prisma } from "../config/db.js";

export const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await prisma.user.count();
        const totalOrders = await prisma.order.count();

        // Total revenue this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const monthlyRevenue = await prisma.order.aggregate({
            where: {
                createdAt: {
                    gte: startOfMonth,
                },
            },
            _sum: {
                total: true,
            },
        });

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalOrders,
                totalRevenue: monthlyRevenue._sum.total || 0,
            },
        });
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
