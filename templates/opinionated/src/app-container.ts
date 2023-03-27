import { AppContainer } from "@expressots/core/";
import { PingModule } from "@usesases/ping/ping.module";
import { UserModule } from "@usesases/user/user.module";

const appContainer = new AppContainer();

const container = appContainer.create([
    // Add your modules here
    PingModule,
    UserModule,
]);

export { container };
