import { useMutation } from "convex/react";
import { useState } from "react";

export const useMutationState = (mutationToRun: any) => {
  const [pending, setPending] = useState(false);
  const mutationFunc = useMutation(mutationToRun);

  const mutate = (payload: any) => {
    setPending(true);

    return mutationFunc(payload)
      .then((res) => {
        return res;
      })
      .catch((error) => {
        throw error;
      })
      .finally(() => setPending(false));
  };
  return { mutate, pending };
};
