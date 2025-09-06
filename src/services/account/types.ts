import { ObjectStatus } from "@/types/enums";

/**
 * JSend response format for API
 * https://labs.jxck.io/jsend
 * @see https://labs.jxck.io/jsend
 * @param status
 * @param message
 * @param data
 */
export interface jSend {
	status: string;
	message: string;
	data?: any;
}

export interface AccountDetails {
	Account: Account;
	Roles: Role[];
	Branch: Branch;
}
export interface AccountDataResponse {
	account: Account;
	roles: Role[];
	branch: Branch;
}

export interface Account {
	Sid: string;
	FirstName: string;
	Fullname: string;
	Code: string;
	Email: string;
	AccountName: string;
	Phone: string;
	IsActive: boolean;
	ObjectStatus: ObjectStatus;
}

export interface Role {
	RoleType: string,
}

export interface Branch {
	Sid: string;
	BranchCode: string;
	BranchName: string;
	ObjectStatus: ObjectStatus;
}