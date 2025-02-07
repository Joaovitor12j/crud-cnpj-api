import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrders, createOrder, deleteOrder, getCustomers, getProducts } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const OrderForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState<Array<{ productId: string; quantity: number }>>([]);
  const { toast } = useToast();

  const { data: customers } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const response = await getCustomers();
      return response.data;
    },
  });

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await getProducts();
      return response.data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId || items.length === 0) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um cliente e adicione pelo menos um produto",
        variant: "destructive",
      });
      return;
    }

    try {
      await createOrder({ customerId, items });
      toast({
        title: "Sucesso",
        description: "Pedido criado com sucesso",
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao criar o pedido",
        variant: "destructive",
      });
    }
  };

  const addItem = () => {
    setItems([...items, { productId: "", quantity: 1 }]);
  };

  const updateItem = (index: number, field: "productId" | "quantity", value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select value={String(customerId)} onValueChange={(value) => setCustomerId(value)}>
        <SelectTrigger>
          <span>
            {customers?.find((c) => String(c.id) === String(customerId))?.companyName || "Selecione o cliente"}
          </span>
        </SelectTrigger>
        <SelectContent>
          {customers?.map((customer: any) => (
            <SelectItem key={customer.id} value={String(customer.id)}>
              {customer.companyName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2 items-end">
            <div className="flex-1">
              <Select
                value={String(item.productId)}
                onValueChange={(value) => {
                  updateItem(index, "productId", value);
                }}
              >
                <SelectTrigger>
                  <span>
                    {products?.find((p) => String(p.id) === String(item.productId))?.description || "Selecione o produto"}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {products?.map((product: any) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value))}
              className="w-24"
            />
            <Button
              type="button"
              variant="destructive"
              onClick={() => removeItem(index)}
            >
              Remover
            </Button>
          </div>
        ))}
      </div>

      <Button type="button" onClick={addItem} variant="outline" className="w-full">
        Adicionar produto
      </Button>

      <Button type="submit" className="w-full">
        Criar ordem
      </Button>
    </form>
  );
};

const Orders = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: orders } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await getOrders();
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast({
        title: "Sucesso",
        description: "Pedido deletado com sucesso",
      });
    },
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Pedidos</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Novo Pedido</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar novo pedido</DialogTitle>
            </DialogHeader>
            <OrderForm
              onSuccess={() => {
                setOpen(false);
                queryClient.invalidateQueries({ queryKey: ["orders"] });
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {orders?.map((order: any) => (
          <Card key={order.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">Pedido #{order.id}</h3>
                <p className="text-sm text-gray-600">
                  Cliente: {order.customer.companyName}
                </p>
                <div className="mt-2">
                  <h4 className="font-medium">Produtos: </h4>
                  <ul className="list-disc list-inside">
                    {order.items.map((item: any, index: number) => (
                      <li key={index} className="text-sm text-gray-600">
                        {item["product"].description} - Quantidade: {item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Excluir</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir pedido</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir esse pedido? A ação não poderá ser desfeita
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteMutation.mutate(order.id)}
                    >
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Orders;