import "..";
import {
  mountRootParcel,
  registerApplication,
  pathToActiveWhen,
  SingleSpaCustomEventDetail,
  SingleSpaNewAppStatus,
  SingleSpaAppsByNewStatus,
} from "single-spa";
import { expectError, expectType } from "tsd";

const appOrParcel = {
  async bootstrap() {},
  async mount() {},
  async unmount() {},
};

mountRootParcel(appOrParcel, {
  hi: "there",
  domElement: document.createElement("div"),
});

expectError(mountRootParcel(appOrParcel, () => {}));

registerApplication({
  name: "app1",
  activeWhen: "/",
  app: appOrParcel,
  customProps: {
    hi: "there",
  },
});

registerApplication({
  name: "app1",
  activeWhen: "/",
  app: appOrParcel,
  customProps: (name: string, location: Location) => ({
    hi: "there",
  }),
});

const activeWhen = pathToActiveWhen("/users/:id");
expectType<boolean>(activeWhen(window.location));

window.addEventListener("single-spa:routing-event", ((
  evt: CustomEvent<SingleSpaCustomEventDetail>
) => {
  expectType<SingleSpaCustomEventDetail>(evt.detail);
  expectType<SingleSpaNewAppStatus>(evt.detail.newAppStatuses);
  expectType<SingleSpaAppsByNewStatus>(evt.detail.appsByNewStatus);
  expectType<number>(evt.detail.totalAppChanges);
  expectType<Event | undefined>(evt.detail.originalEvent);
  expectType<string>(evt.detail.oldUrl);
  expectType<string>(evt.detail.newUrl);
  expectType<boolean>(evt.detail.navigationIsCanceled);
  expectType<(() => void) | undefined>(evt.detail.cancelNavigation);
}) as EventListener);
