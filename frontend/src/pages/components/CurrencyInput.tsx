import { Input } from "@/components/ui/input";

const CurrencyInput = ({ value, onChange }) => {
    const handleChange = (e) => {
        let rawValue = e.target.value.replace(/\D/g, "");
        let numericValue = Number(rawValue) / 100;
        onChange(numericValue);
    };

    return (
        <Input
            value={value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
            })}
            onChange={handleChange}
            required
        />
    );
};

export default CurrencyInput;