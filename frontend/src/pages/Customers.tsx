import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCustomers, CustomerData } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCNPJ } from "@/utils/formatters";
import CustomerForm from "@/pages/customer/CustomerForm.tsx";

const Customers = () => {
  const [open, setOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<(CustomerData & { id: string }) | null>(null);
  const { data: customers, refetch } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const response = await getCustomers();
      return response.data;
    },
  });

  const handleEdit = (customer: CustomerData & { id: string }) => {
    setEditingCustomer(customer);
    setOpen(true);
  };

  const handleNew = () => {
    setEditingCustomer(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingCustomer(null);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Clientes</h1>
        <Button onClick={handleNew}>Novo cliente</Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCustomer ? "Editar cliente" : "Criar novo cliente"}
            </DialogTitle>
          </DialogHeader>
          <CustomerForm
            onSuccess={() => {
              handleClose();
              refetch();
            }}
            initialData={editingCustomer || undefined}
          />
        </DialogContent>
      </Dialog>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>CNPJ</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers?.map((customer: CustomerData & { id: string }) => (
              <TableRow key={customer.id}>
                <TableCell>{formatCNPJ(customer.cnpj)}</TableCell>
                <TableCell>{customer.companyName}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(customer)}
                  >
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Customers;