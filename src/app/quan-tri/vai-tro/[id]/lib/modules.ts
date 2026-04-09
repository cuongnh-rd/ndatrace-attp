import { modules, defaultPermissions } from "@/lib/mock-data";

export const modulesByName = modules.map((modName) => ({
    name: modName,
    roles: Object.fromEntries(
        Object.entries(defaultPermissions).map(([roleId, perms]) => [roleId, perms[modName]])
    ),
}));
