import { CheckService } from "../domain/use-cases/checks/check-service";
import { CronService } from "./cron/cron-service";

export class Server {

  static start() {
    console.log('Server started..');
    CronService.createJob(
      '*/5 * * * * *',
      () => {
        new CheckService(
          () => console.log('success'),
          (error) => console.log(error),
        ).execute('https://google.com')
      }
    );
  }
}

