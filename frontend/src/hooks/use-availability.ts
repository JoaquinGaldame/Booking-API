import { useMutation } from "@tanstack/react-query";

import { checkAvailability } from "../services/properties";

export function useAvailabilityMutation() {
  return useMutation({
    mutationFn: checkAvailability,
  });
}
