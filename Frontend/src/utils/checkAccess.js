import { hasPermission } from "./hasPermission";

export const checkAccess = (
    module,
    action,
    callback
) => {
    if (
        hasPermission(
            module,
            action
        )
    ) {
        callback();
    }
    else {
        alert(
            `You are not permitted to ${action} ${module}`
        );

    }

};