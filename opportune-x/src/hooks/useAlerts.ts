import { useQuery } from "@tanstack/react-query";
import { getAlerts } from "../api/user";

export const ALERTS_QUERY_KEY = ["alerts"];

export const useAlerts = (enabled: boolean) =>
  useQuery({
    queryKey: ALERTS_QUERY_KEY,
    queryFn: getAlerts,
    enabled,
    staleTime: 60 * 1000,
  });

