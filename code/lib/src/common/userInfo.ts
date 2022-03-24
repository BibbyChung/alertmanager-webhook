export type RoleType = 'admin' | 'member';

export type UserInfo = {
	id: string;
	name: string;
	avatarBase64Id?: string;
	roleNames?: RoleType[];
};
