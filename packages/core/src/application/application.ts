import express from "express";
import { Container } from "inversify";
import { provide } from "inversify-binding-decorators";
import { InversifyExpressServer } from "inversify-express-utils";
import { Console } from "../console/console";
import { IEnv } from "./ienv";
import { LogLevel, log } from "../logger";
import { Environments } from "../environment";

@provide(Application)
class Application {

    private app: express.Application;
    private port: any;

    constructor() { }

    /* Add any service that you want to be initialized before the server starts */
    protected configureServices(): void {

        /* Check if .env file exists and all environment variables are defined */
        Environments.CheckAll();
    }

    /* Add any service that you want to execute after the server starts */
    protected postServerInitialization(): void { }

    /* Add any service that you want to execute after server is shutdown */
    protected serverShutdown(): void {

        log(LogLevel.Info, "API is shutting down", "application-provider");
        process.exit(0);
    }

    public create(container: Container, middlewares: express.RequestHandler[] = []): Application {

        this.configureServices();

        const expressServer = new InversifyExpressServer(container);

        expressServer.setConfig((app: express.Application) => {

            middlewares.forEach(middleware => {
                app.use(middleware);
            });
        });

        this.app = expressServer.build();

        return this;
    }

    public listen(port: any, env?: IEnv): void {
        this.port = port;

        this.app.listen(this.port, () => {

            new Console().messageServer(this.port, env || {} as IEnv);

            /* Shutdown the API */
            process.on("SIGINT", this.serverShutdown);
        });

        this.postServerInitialization();
    }
}

const appServerInstance: Application = new Application();

export { appServerInstance as AppInstance, Application };