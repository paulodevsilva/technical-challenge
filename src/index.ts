import { SetupServer } from './server';

enum ExitStatus {
  Failure = 1,
  Success = 0,
}

process.on('unhandledRejection', (reason, promise) => {
  console.log(
    `App exiting due to an unhandled promise: ${promise} and reason: ${reason}`
  );

  // lets throw the error and let the uncaughtException handle below handle it
  throw reason;
});

process.on('uncaughtException', (error) => {
  console.log(`App exiting due to an uncaught exception: ${error}`);

  process.exit(ExitStatus.Failure);
});

(async (): Promise<void> => {
  try {
    const server = new SetupServer(process.env.API_PORT);
    await server.init();
    server.start();
  } catch (error) {
    console.log(`App exited with error: ${error}`);

    process.exit(ExitStatus.Failure);
  }
})();
