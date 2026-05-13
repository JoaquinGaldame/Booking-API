import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createProperty, listProperties } from "../services/properties";

export function usePropertiesQuery() {
  return useQuery({
    queryKey: ["properties"],
    queryFn: listProperties,
  });
}

export function useCreatePropertyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProperty,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
}
