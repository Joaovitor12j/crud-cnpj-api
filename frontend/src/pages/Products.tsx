import {useState} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {deleteProduct, getProducts} from "@/services/api";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import ProductForm from "./product/ProductForm.tsx";
import ProductList from "./product/ProductList";
import {Button} from "@/components/ui/button";
import {useToast} from "@/components/ui/use-toast";

const Products = () => {
  const [open, setOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: products } = useQuery({ queryKey: ["products"], queryFn: async () => (await getProducts()).data });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Sucesso", description: "Produto excluído com sucesso" });
    },
    onError: (error) => {
      // @ts-ignore
      const {data} = error.response;
      toast({ title: "Erro", description: data.message, variant: "destructive" });
    },
  });

  return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Produtos</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Novo produto</Button>
            </DialogTrigger>
            <DialogContent>
              <ProductForm
                  initialData={editProduct}
                  onSuccess={() => {
                    setOpen(false);
                    setEditProduct(null);
                    queryClient.invalidateQueries({ queryKey: ["products"] });
                  }}
              />
            </DialogContent>
          </Dialog>
        </div>
        <ProductList products={products} onEdit={(product) => { setEditProduct(product); setOpen(true); }} onDelete={deleteMutation.mutate} />
      </div>
  );
};

export default Products;