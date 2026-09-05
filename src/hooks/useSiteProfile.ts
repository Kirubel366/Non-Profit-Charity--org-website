import { useQuery } from "@tanstack/react-query";
import { getSiteProfile } from "@/lib/public.functions";

export function useSiteProfile() {
  const query = useQuery({
    queryKey: ["site-profile"],
    queryFn: async () => {
      try {
        const data = await getSiteProfile();
        return data;
      } catch (err) {
        console.error("useSiteProfile: getSiteProfile failed", err);
        return { email: null, phones: [] };
      }
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  return {
    email: query.data?.email ?? null,
    phones: query.data?.phones ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  } as const;
}

export default useSiteProfile;
