import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

/* Clientes */
export const getCustomers = () => api.get("/customers");
export const createCustomer = (data: CustomerData) => api.post("/customers", data);
export const updateCustomer = (id: string, data: CustomerData) => api.put(`/customers/${id}`, data);
export const getCustomerByCNPJ = (cnpj: string) => api.get(`/cnpj/${cnpj}`);

/* Produtos */
export const getProducts = () => api.get("/products");
export const createProduct = (data: FormData) =>
    api.post("/products", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
export const updateProduct = (id: string, data: FormData) =>
    api.put(`/products/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
export const deleteProduct = (id: string) => api.delete(`/products/${id}`);

/* Pedidos */
export const getOrders = () => api.get("/orders");
export const createOrder = (data: OrderData) => api.post("/orders", data);
export const deleteOrder = (id: string) => api.delete(`/orders/${id}`);

export interface CustomerData {
  cnpj: string;
  companyName: string;
  email: string;
}

export interface ProductData {
  description: string;
  salesValue: number;
  stock: number;
  images?: (File | string)[];
}

export interface OrderData {
  customerId: string;
  items: OrderItem[];
}

export interface OrderItem {
  productId: string;
  quantity: number;
}