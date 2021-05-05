import {
    LOAD_ERROR, LOADING_SOURCE_CODE, MOUNTED, NOT_BOOTSTRAPPED,
    NOT_LOADED, NOT_MOUNTED,
    shouldBeActive,
    SKIP_BECAUSE_BROKEN, toName
} from "../originalCode/src/applications/app.helpers";
import {getAppUnloadInfo} from "../originalCode/src/lifecycles/unload";

export function getAppChanges() {
    const appsToUnload = [],
        appsToUnmount = [],
        appsToLoad = [],
        appsToMount = [];

    // We re-attempt to download applications in LOAD_ERROR after a timeout of 200 milliseconds
    const currentTime = new Date().getTime();

    apps.forEach((app) => {
        const appShouldBeActive =
            app.status !== SKIP_BECAUSE_BROKEN && shouldBeActive(app);

        switch (app.status) {
            case LOAD_ERROR:
                if (appShouldBeActive && currentTime - app.loadErrorTime >= 200) {
                    appsToLoad.push(app);
                }
                break;
            case NOT_LOADED:
            case LOADING_SOURCE_CODE:
                if (appShouldBeActive) {
                    appsToLoad.push(app);
                }
                break;
            case NOT_BOOTSTRAPPED:
            case NOT_MOUNTED:
                if (!appShouldBeActive && getAppUnloadInfo(toName(app))) {
                    appsToUnload.push(app);
                } else if (appShouldBeActive) {
                    appsToMount.push(app);
                }
                break;
            case MOUNTED:
                if (!appShouldBeActive) {
                    appsToUnmount.push(app);
                }
                break;
            // all other statuses are ignored
        }
    });

    return { appsToUnload, appsToUnmount, appsToLoad, appsToMount };
}

