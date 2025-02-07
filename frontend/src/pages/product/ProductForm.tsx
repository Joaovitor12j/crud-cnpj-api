import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CurrencyInput from "../components/CurrencyInput.tsx";
import { useToast } from "@/components/ui/use-toast";
import { updateProduct, createProduct, ProductData } from "@/services/api";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx";

const ProductForm = ({ onSuccess, initialData }) => {
    const [formData, setFormData] = useState<ProductData>({
        description: initialData?.description || "",
        salesValue: initialData?.salesValue || 0,
        stock: initialData?.stock || 0,
        images: [],
    });
    const { toast } = useToast();

    useEffect(() => {
        if (initialData) {
            setFormData({
                description: initialData.description || "",
                salesValue: initialData.salesValue || 0,
                stock: initialData.stock || 0,
                images: [],
            });
        }
    }, [initialData]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const filesArray = Array.from(e.target.files);
        setFormData((prevData) => ({
            ...prevData,
            images: prevData.images ? [...prevData.images, ...filesArray] : filesArray,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData();
        form.append("description", formData.description);
        form.append("salesValue", formData.salesValue.toString());
        form.append("stock", formData.stock.toString());
        formData.images.forEach((image) => {
            if (image instanceof File) {
                form.append("image", image);
            }
        });

        console.log("FormData Entries:");
        for (let pair of form.entries()) {
            console.log(pair[0], pair[1]);
        }

        try {
            if (initialData) {
                await updateProduct(initialData.id, form);
            } else {
                await createProduct(form);
            }
            toast({ title: "Sucesso", description: `Produto ${initialData ? "atualizado" : "criado"} com sucesso` });
            onSuccess();
        } catch (error) {
            toast({ title: "Erro", description: "Falha ao salvar o produto", variant: "destructive" });
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <DialogHeader>
                <DialogTitle>{initialData ? "Editar produto" : "Criar novo produto"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input placeholder="Descrição" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
                <CurrencyInput value={formData.salesValue} onChange={(val) => setFormData({ ...formData, salesValue: val })} />
                <Input type="number" placeholder="Estoque" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })} required />
                <Input type="file" multiple accept="image/*" onChange={handleImageChange} />
                <Button type="submit">{initialData ? "Atualizar" : "Criar"} Produto</Button>
            </form>
        </div>
    );
};

export default ProductForm;
