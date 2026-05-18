import { updateProfile } from "@/app/actions/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUserQueries = () => {
  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: (data: { name: string }) => updateProfile(data),
    onSuccess: (result) => {
      if (result.success) queryClient.invalidateQueries({ queryKey: ["user-stats"] });
    },
  });

  return { updateProfileMutation };
};