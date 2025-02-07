import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const ProductList = ({ products, onEdit, onDelete }) => {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {products?.map((product) => (
                <Card key={product.id} className="p-4 flex">
                <div className="w-2/3">
                    <h3 className="font-semibold">{product.description}</h3>
                <p className="text-sm">Valor: {formatCurrency(product.salesValue)}</p>
                    <p className="text-sm">Estoque: {product.stock}</p>
                    <div className="flex gap-2 mt-4">
                        <Button variant="outline" onClick={() => onEdit(product)}>Editar</Button>
                        <Button variant="destructive" onClick={() => onDelete(product.id)}>Excluir</Button>
                    </div>
                </div>
                    <div className="w-1/3 flex justify-end">
                        <img src={product.images} alt={product.description} className="object-cover h-full w-full" />
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default ProductList;