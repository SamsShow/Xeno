import { Request, Response } from "express";
import { Customer } from "../models";
import { Op } from "sequelize";

// GET all customers
export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const search = req.query.search as string;
    const tag = req.query.tag as string;

    let whereClause: any = {};

    // Search filter
    if (search) {
      whereClause = {
        [Op.or]: [
          { firstName: { [Op.like]: `%${search}%` } },
          { lastName: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { company: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    // Tag filter
    if (tag) {
      whereClause.tags = {
        [Op.like]: `%${tag}%`,
      };
    }

    const { count, rows: customers } = await Customer.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      status: "success",
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      customers,
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch customers",
    });
  }
};

// GET customer by ID
export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const customerId = req.params.id;

    const customer = await Customer.findByPk(customerId, {
      include: ["communications", "campaigns"],
    });

    if (!customer) {
      return res.status(404).json({
        status: "error",
        message: "Customer not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: customer,
    });
  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch customer",
    });
  }
};

// CREATE new customer
export const createCustomer = async (req: Request, res: Response) => {
  try {
    const customerData = req.body;

    // Check if email already exists
    const existingCustomer = await Customer.findOne({
      where: { email: customerData.email },
    });

    if (existingCustomer) {
      return res.status(400).json({
        status: "error",
        message: "Customer with this email already exists",
      });
    }

    const customer = await Customer.create(customerData);

    res.status(201).json({
      status: "success",
      data: customer,
    });
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to create customer",
    });
  }
};

// UPDATE customer
export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const customerId = req.params.id;
    const customerData = req.body;

    const customer = await Customer.findByPk(customerId);

    if (!customer) {
      return res.status(404).json({
        status: "error",
        message: "Customer not found",
      });
    }

    // Check if updating email and if it exists
    if (customerData.email && customerData.email !== customer.email) {
      const existingCustomer = await Customer.findOne({
        where: { email: customerData.email },
      });

      if (existingCustomer) {
        return res.status(400).json({
          status: "error",
          message: "Customer with this email already exists",
        });
      }
    }

    await customer.update(customerData);

    res.status(200).json({
      status: "success",
      data: customer,
    });
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to update customer",
    });
  }
};

// DELETE customer
export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const customerId = req.params.id;

    const customer = await Customer.findByPk(customerId);

    if (!customer) {
      return res.status(404).json({
        status: "error",
        message: "Customer not found",
      });
    }

    await customer.destroy();

    res.status(200).json({
      status: "success",
      message: "Customer deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to delete customer",
    });
  }
};
