
export interface getAllUsersRequest{
    currentPage : number;
    searchTerm?: string;
    stateParam?: "" | "true" | "false";
    itemsPerPage: number;
}

