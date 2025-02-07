import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const ProductList = ({ products, onEdit, onDelete }) => {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {products?.map((product) => (
                <Card key={product.id} className="p-4">
                    <h3 className="font-semibold">{product.description}</h3>
                    <p className="text-sm">Valor: {formatCurrency(product.salesValue)}</p>
                    <p className="text-sm">Estoque: {product.stock}</p>
                    <div className="flex gap-2 mt-4">
                        <Button variant="outline" onClick={() => onEdit(product)}>Editar</Button>
                        <Button variant="destructive" onClick={() => onDelete(product.id)}>Excluir</Button>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default ProductList;