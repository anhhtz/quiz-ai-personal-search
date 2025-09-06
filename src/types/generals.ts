export interface OrganizationInput {
    BranchCode: string;
    BranchName: string;
    OrganizationType: number;
}

export interface OrganizationSearchParams {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}