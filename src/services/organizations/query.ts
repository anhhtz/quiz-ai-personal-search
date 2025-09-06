import { Organization } from "@/types/api-mappings";
import { useQuery } from "@tanstack/react-query";
import ky from "ky";

interface OrganizationsResponse {
    data: {
        organizations: Organization[];
        total: number;
    };
}

export function useOrganizations(page: number = 1, limit: number = 10) {
    return useQuery({
        queryKey: ["organizations", page, limit],
        queryFn: async () => {
            const response = await ky
                .get("/api/admin/organizations", {
                    searchParams: {
                        page,
                        limit,
                    },
                })
                .json<OrganizationsResponse>();
            return response;
        },
    });
}