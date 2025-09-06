import { OrganizationInput } from "@/types/generals";
import { useMutation } from "@tanstack/react-query";
import ky from "ky";

const createOrganization = async (data: OrganizationInput) => {
    const response = await ky
        .post("/api/organizations", { json: data })
        .json<{ data: any }>();
    return response.data;
};

export const useCreateOrganization = () => {
    return useMutation({
        mutationFn: createOrganization,
    });
};