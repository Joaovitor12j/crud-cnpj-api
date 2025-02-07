import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {createCustomer, CustomerData, updateCustomer} from "@/services/api";
import { formatCNPJ, unformatCNPJ } from "@/utils/formatters";

const CustomerForm = ({ onSuccess, initialData }: { onSuccess: () => void, initialData?: CustomerData }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<CustomerData>({
        cnpj: "",
        companyName: "",
        email: "",
    });
    const { toast } = useToast();

    useEffect(() => {
        if (initialData) {
            setFormData({
                cnpj: initialData.cnpj || "",
                companyName: initialData.companyName || "",
                email: initialData.email || "",
            });
            setStep(2);
        } else {
            setFormData({
                cnpj: "",
                companyName: "",
                email: "",
            });
            setStep(1);
        }
    }, [initialData]);

    const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = unformatCNPJ(e.target.value);
        const formattedValue = formatCNPJ(rawValue);
        setFormData({ ...formData, cnpj: formattedValue });
    };

    const handleCNPJSubmit = async () => {
        try {
            const response = await fetch(`http://localhost:3000/cnpj/${unformatCNPJ(formData.cnpj)}`);
            const data = await response.json();

            if (response.ok) {
                setFormData({
                    ...formData,
                    companyName: data.companyName,
                    email: data.email,
                });
                setStep(2);
            } else {
                toast({
                    title: "Erro",
                    description: "CNPJ não encontrado",
                    variant: "destructive",
                });
                setStep(2);
            }
        } catch (error) {
            toast({
                title: "Erro",
                description: "Falha ao validar o CNPJ",
                variant: "destructive",
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (initialData) {
                // @ts-ignore
                const { id } = initialData;
                await updateCustomer(id, {
                    ...formData,
                    companyName: formData.companyName,
                    email: formData.email,
                });
                toast({
                    title: "Sucesso",
                    description: "Cliente atualizado com sucesso",
                });
            } else {
                await createCustomer({
                    ...formData,
                    cnpj: unformatCNPJ(formData.cnpj),
                    email: formData.email,
                });
                toast({
                    title: "Sucesso",
                    description: "Cliente criado com sucesso",
                });
            }
            onSuccess();
        } catch (error) {
            const {data} = error.response;
            toast({
                title: "Erro",
                description: data.message,
                variant: "destructive",
            });
        }
    };

    if (step === 1) {
        return (
            <div className="space-y-4">
                <div>
                    <Input
                        placeholder="CNPJ"
                        onChange={handleCNPJChange}
                        value={formData.cnpj}
                        maxLength={18}
                        required
                    />
                </div>
                <Button onClick={handleCNPJSubmit} className="w-full">
                    Avançar
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Input
                    placeholder="CNPJ"
                    value={formatCNPJ(formData.cnpj)}
                    onChange={handleCNPJChange}
                    maxLength={18}
                    required
                    disabled
                />
            </div>
            <div>
                <Input
                    placeholder="Nome"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    required
                />
            </div>
            <div>
                <Input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />
            </div>
            <Button type="submit" className="w-full">{initialData ? "Atualizar" : "Criar"} Cliente</Button>
        </form>
    );
};

export default CustomerForm;
