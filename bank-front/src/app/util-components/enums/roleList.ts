
export interface RoleList {
    id: number;
    name: string;
}

export const roleList: RoleList[] = [
    { id: 1, name: 'ADMIN' },
    { id: 2, name: 'BANKER_CLIENT' },
    { id: 3, name: 'BANKER_ACCOUNT' },
    { id: 4, name: 'BANKER_OBSERVE' },
];