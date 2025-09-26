import { useQuery } from "@tanstack/react-query";
import { getPropertyAgent } from "@/lib/data/client";

interface AgentData {
  id: string;
  email: string;
  phone: string;
}

export const usePropertyAgent = (userId: string, enabled: boolean = false) => {
  return useQuery<AgentData>({
    queryKey: ["propertyAgent", userId],
    queryFn: async () => {
      const agent = await getPropertyAgent(userId);
      return (
        agent ?? {
          id: "",
          email: "",
          phone: "",
        }
      );
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};
