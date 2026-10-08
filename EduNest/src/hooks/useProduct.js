import { useQuery } from "@tanstack/react-query"
import { getProducts } from "../Api/productApi"


function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  })
}


export default useProducts
