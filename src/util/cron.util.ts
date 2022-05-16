import cron from 'node-cron';

export const cronJob = (cronTime: string, callback: Function) => {
  cron.schedule(
    cronTime,
    () => {
      console.log('running a task every minute');

      callback();
    },
    'America/Sao_Paulo'
  );
};
