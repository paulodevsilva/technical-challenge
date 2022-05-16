export default function execParallel(
  array: [],
  callback: (item: any, index: number) => Promise<any>
): Promise<any> {
  return new Promise((resolve, reject) => {
    const promises = [];
    for (let i = 0; i < array.length; i++) {
      promises.push(callback(array[i], i));
    }
    Promise.all(promises).then(resolve).catch(reject);
  });
}
