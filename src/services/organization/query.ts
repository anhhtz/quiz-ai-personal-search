
import { Organization } from "@/types/api-mappings";
import { OrganizationSearchParams } from "@/types/generals";
import { useQuery } from "@tanstack/react-query";
import ky from "ky";

export const fetchOrganizations = async (params: OrganizationSearchParams) => {
    const response = await ky
        .get("/api/organizations", {
            searchParams: {
                ...params,
                includeRegion: true, // Add this parameter to include region data
            },
        })
        .json<{
            data: {
                organizations: Organization[];
                total: number;
            };
        }>();
    return response.data;
};

export const useOrganizations = (params: OrganizationSearchParams) => {
    return useQuery({
        queryKey: ["organizations", params],
        queryFn: () => fetchOrganizations(params),
    });
};