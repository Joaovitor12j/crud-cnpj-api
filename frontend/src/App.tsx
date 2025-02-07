import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Customers from "./pages/Customers";
import ProductForm from "./pages/Products.tsx";
import Orders from "./pages/Orders";

const queryClient = new QueryClient();

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gray-50">
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex gap-6">
          <Link
            to="/clientes"
            className="text-gray-700 hover:text-gray-900 transition-colors"
          >
            Clientes
          </Link>
          <Link
            to="/produtos"
            className="text-gray-700 hover:text-gray-900 transition-colors"
          >
            Produtos
          </Link>
          <Link
            to="/pedidos"
            className="text-gray-700 hover:text-gray-900 transition-colors"
          >
            Pedidos
          </Link>
        </div>
      </div>
    </nav>
    <main>{children}</main>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Customers />} />
          <Route path="/clientes" element={<Customers />} />
          <Route path="/produtos" element={<ProductForm />} />
          <Route path="/pedidos" element={<Orders />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;