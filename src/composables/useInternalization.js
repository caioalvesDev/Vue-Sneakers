export const useInternalization = (number) => {
  const options = {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 3
  }
  return new Intl.NumberFormat('pt-BR', options).format(number)
}
