export const formatCNPJ = (value: string) => {
    const cnpj = value.replace(/\D/g, '');
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

export const unformatCNPJ = (value: string) => {
    return value.replace(/\D/g, '');
};