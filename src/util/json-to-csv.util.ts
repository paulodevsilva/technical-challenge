import { Parser } from 'json2csv';

export function jsonToCsv(json: Record, fields: Array<string>): any {
  const parser = new Parser({ fields });
  const csv = parser.parse(json);
  return csv;
}
