import Permission from "../models/Role.js";

export const createPermission = async (req, res) => {
    try {
        const { roleName, permissions } = req.body;

        const existing = await Permission.findOne({ roleName });

        if (existing) {
            existing.permissions = permissions;

            await existing.save();

            return res.status(200).json({
                success: true,
                data: existing,
            });
        }

        const permission = await Permission.create({
            roleName,
            permissions,
        });

        res.status(201).json({
            success: true,
            data: permission,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getPermissions = async (req, res) => {
    try {
        const permissions = await Permission.find();

        res.status(200).json({
            success: true,
            data: permissions,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getSinglePermission = async (req, res) => {
    try {
        const permission = await Permission.findById(req.params.id);

        if (!permission) {
            return res.status(404).json({
                success: false,
                message: "Permission Not Found",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updatePermission = async (req, res) => {
    try {
        const updated = await Permission.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        );

        res.status(200).json({
            success: true,
            data: updated,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const deletePermission = async (req, res) => {
    try {
        await Permission.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Permission Deleted Successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

























